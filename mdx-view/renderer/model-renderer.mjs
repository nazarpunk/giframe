// noinspection JSBitwiseOperatorUsage

import {NodeFlags, LayerShading, FilterMode} from '../model.mjs';
import {vec3, quat, mat3, mat4} from './../gl-matrix/index.mjs';
import {mat4fromRotationOrigin, getShader} from './util.mjs';
import {ModelInterp} from './modelInterp.mjs';
import {ParticlesController} from './particles.mjs';
import {RibbonsController} from './ribbons.mjs';

const MAX_NODES = 256;
const vertexShaderHardwareSkinning = `
    attribute vec3 aVertexPosition;
    attribute vec3 aNormal;
    attribute vec2 aTextureCoord;
    attribute vec4 aGroup;

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;
    uniform mat4 uNodesMatrices[${MAX_NODES}];

    varying vec3 vNormal;
    varying vec2 vTextureCoord;

    void main(void) {
        vec4 position = vec4(aVertexPosition, 1.0);
        int count = 1;
        vec4 sum = uNodesMatrices[int(aGroup[0])] * position;

        if (aGroup[1] < ${MAX_NODES}.) {
            sum += uNodesMatrices[int(aGroup[1])] * position;
            count += 1;
        }
        if (aGroup[2] < ${MAX_NODES}.) {
            sum += uNodesMatrices[int(aGroup[2])] * position;
            count += 1;
        }
        if (aGroup[3] < ${MAX_NODES}.) {
            sum += uNodesMatrices[int(aGroup[3])] * position;
            count += 1;
        }
        sum.xyz /= float(count);
        sum.w = 1.;
        position = sum;

        gl_Position = uPMatrix * uMVMatrix * position;
        vTextureCoord = aTextureCoord;
        vNormal = aNormal;
    }
`;
const vertexShaderSoftwareSkinning = `
    attribute vec3 aVertexPosition;
    attribute vec3 aNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;

    varying vec3 vNormal;
    varying vec2 vTextureCoord;

    void main(void) {
        vec4 position = vec4(aVertexPosition, 1.0);
        gl_Position = uPMatrix * uMVMatrix * position;
        vTextureCoord = aTextureCoord;
        vNormal = aNormal;
    }
`;
const fragmentShader = `
    precision mediump float;

    varying vec3 vNormal;
    varying vec2 vTextureCoord;

    uniform sampler2D uSampler;
    uniform vec3 uReplaceableColor;
    uniform float uReplaceableType;
    uniform float uDiscardAlphaLevel;
    uniform mat3 uTVextexAnim;

    float hypot (vec2 z) {
        float t;
        float x = abs(z.x);
        float y = abs(z.y);
        t = min(x, y);
        x = max(x, y);
        t = t / x;
        return (z.x == 0.0 && z.y == 0.0) ? 0.0 : x * sqrt(1.0 + t * t);
    }

    void main(void) {
        vec2 texCoord = (uTVextexAnim * vec3(vTextureCoord.s, vTextureCoord.t, 1.)).st;

        if (uReplaceableType == 0.) {
            gl_FragColor = texture2D(uSampler, texCoord);
        } else if (uReplaceableType == 1.) {
            gl_FragColor = vec4(uReplaceableColor, 1.0);
        } else if (uReplaceableType == 2.) {
            float dist = hypot(texCoord - vec2(0.5, 0.5)) * 2.;
            float truncateDist = clamp(1. - dist * 1.4, 0., 1.);
            float alpha = sin(truncateDist);
            gl_FragColor = vec4(uReplaceableColor * alpha, 1.0);
        }

        // hand-made alpha-test
        if (gl_FragColor[3] < uDiscardAlphaLevel) {
            discard;
        }
    }
`;
const vertexShaderHDHardwareSkinning = `
    attribute vec3 aVertexPosition;
    attribute vec3 aNormal;
    attribute vec2 aTextureCoord;
    attribute vec4 aSkin;
    attribute vec4 aBoneWeight;
    attribute vec4 aTangent;

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;
    uniform mat4 uNodesMatrices[${MAX_NODES}];

    varying vec3 vNormal;
    varying vec3 vTangent;
    varying vec3 vBinormal;
    varying vec2 vTextureCoord;
    varying mat3 vTBN;
    varying vec3 vFragPos;

    mat3 transpose(mat3 inMatrix) {
        vec3 i0 = inMatrix[0];
        vec3 i1 = inMatrix[1];
        vec3 i2 = inMatrix[2];
        mat3 outMatrix = mat3(
                     vec3(i0.x, i1.x, i2.x),
                     vec3(i0.y, i1.y, i2.y),
                     vec3(i0.z, i1.z, i2.z)
                     );
        return outMatrix;
    }

    void main(void) {
        vec4 position = vec4(aVertexPosition, 1.0);
        mat4 sum;

        // sum += uNodesMatrices[int(aSkin[0])] * 1.;
        sum += uNodesMatrices[int(aSkin[0])] * aBoneWeight[0];
        sum += uNodesMatrices[int(aSkin[1])] * aBoneWeight[1];
        sum += uNodesMatrices[int(aSkin[2])] * aBoneWeight[2];
        sum += uNodesMatrices[int(aSkin[3])] * aBoneWeight[3];

        mat3 rotation = mat3(sum);

        position = sum * position;
        position.w = 1.;

        gl_Position = uPMatrix * uMVMatrix * position;
        vTextureCoord = aTextureCoord;

        vec3 normal = aNormal;
        vec3 tangent = aTangent.xyz;

        // https://learnopengl.com/Advanced-Lighting/Normal-Mapping
        tangent = normalize(tangent - dot(tangent, normal) * normal);

        vec3 binormal = cross(normal, tangent) * aTangent.w;

        normal = normalize(rotation * normal);
        tangent = normalize(rotation * tangent);
        binormal = normalize(rotation * binormal);

        vNormal = normal;
        vTangent = tangent;
        vBinormal = binormal;

        vTBN = mat3(tangent, binormal, normal);

        vFragPos = position.xyz;
    }
`;
const fragmentShaderHD = `
    precision mediump float;

    varying vec2 vTextureCoord;
    varying vec3 vNormal;
    varying vec3 vTangent;
    varying vec3 vBinormal;
    varying mat3 vTBN;
    varying vec3 vFragPos;

    uniform sampler2D uSampler;
    uniform sampler2D uNormalSampler;
    uniform sampler2D uOrmSampler;
    uniform vec3 uReplaceableColor;
    uniform float uDiscardAlphaLevel;
    uniform mat3 uTVextexAnim;
    uniform vec3 uLightPos;
    uniform vec3 uCameraPos;

    const vec3 lightColor = vec3(4.);
    const float PI = 3.14159265359;
    const float gamma = 2.2;

    float distributionGGX(vec3 normal, vec3 halfWay, float roughness) {
        float a = roughness * roughness;
        float a2 = a * a;
        float nDotH = max(dot(normal, halfWay), 0.0);
        float nDotH2 = nDotH * nDotH;

        float num = a2;
        float denom = (nDotH2 * (a2 - 1.0) + 1.0);
        denom = PI * denom * denom;

        return num / denom;
    }

    float geometrySchlickGGX(float nDotV, float roughness) {
        float r = roughness + 1.;
        float k = r * r / 8.;
        // float k = roughness * roughness / 2.;

        float num = nDotV;
        float denom = nDotV * (1. - k) + k;
        
        return num / denom;
    }

    float geometrySmith(vec3 normal, vec3 viewDir, vec3 lightDir, float roughness) {
        float nDotV = max(dot(normal, viewDir), .0);
        float nDotL = max(dot(normal, lightDir), .0);
        float ggx2  = geometrySchlickGGX(nDotV, roughness);
        float ggx1  = geometrySchlickGGX(nDotL, roughness);
        
        return ggx1 * ggx2;
    }

    vec3 fresnelSchlick(float lightFactor, vec3 f0) {
        return f0 + (1. - f0) * pow(clamp(1. - lightFactor, 0., 1.), 5.);
    }  

    void main(void) {
        vec2 texCoord = (uTVextexAnim * vec3(vTextureCoord.s, vTextureCoord.t, 1.)).st;
        vec4 resultColor = texture2D(uSampler, texCoord);

        vec4 orm = texture2D(uOrmSampler, texCoord);

        float occlusion = orm.r;
        float roughness = orm.g;
        float metallic = orm.b;
        float teamColorFactor = orm.a;

        vec4 baseColor = texture2D(uSampler, texCoord);
        vec3 teamColor = baseColor.rgb * uReplaceableColor;
        baseColor.rgb = mix(baseColor.rgb, teamColor, teamColorFactor);
        baseColor.rgb = pow(baseColor.rgb, vec3(gamma));

        resultColor.rgb = mix(resultColor.rgb, resultColor.rgb * uReplaceableColor, teamColorFactor);
        vec3 normal = texture2D(uNormalSampler, texCoord).rgb;
        normal = normal * 2.0 - 1.0;
        normal.x = -normal.x;
        normal.y = -normal.y;
        normal = normalize(vTBN * -normal);

        vec3 viewDir = normalize(uCameraPos - vFragPos);

        vec3 lightDir = normalize(uLightPos - vFragPos);
        float lightFactor = max(dot(normal, lightDir), .0);
        vec3 radiance = lightColor;

        vec3 f0 = vec3(.04);
        f0 = mix(f0, baseColor.rgb, metallic);

        vec3 totalLight = vec3(0.);
        vec3 halfWay = normalize(viewDir + lightDir);
        float ndf = distributionGGX(normal, halfWay, roughness);
        float g = geometrySmith(normal, viewDir, lightDir, roughness);
        vec3 f = fresnelSchlick(max(dot(halfWay, viewDir), 0.), f0); 

        vec3 kS = f;
        // vec3 kD = vec3(1.) - kS;
        vec3 kD = vec3(1.);
        // kD *= 1.0 - metallic;
        vec3 num = ndf * g * f;
        float denom = 4. * max(dot(normal, viewDir), 0.) * max(dot(normal, lightDir), 0.) + .0001;
        vec3 specular = num / denom;

        totalLight += (kD * baseColor.rgb / PI + specular) * radiance * lightFactor;

        vec3 ambient = vec3(.03) * baseColor.rgb * occlusion;
        vec3 color = ambient + totalLight;
        
        color = pow(color, vec3(1. / gamma));
    
        gl_FragColor = vec4(color, 1.);

        // hand-made alpha-test
        if (gl_FragColor[3] < uDiscardAlphaLevel) {
            discard;
        }
    }
`;
const skeletonVertexShader = `
    attribute vec3 aVertexPosition;
    attribute vec3 aColor;

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;

    varying vec3 vColor;

    void main(void) {
        vec4 position = vec4(aVertexPosition, 1.0);
        gl_Position = uPMatrix * uMVMatrix * position;
        vColor = aColor;
    }
`;
const skeletonFragmentShader = `
    precision mediump float;

    varying vec3 vColor;

    void main(void) {
        gl_FragColor = vec4(vColor, 1.0);
    }
`;
const translation = vec3.create();
const rotation = quat.create();
const scaling = vec3.create();
const defaultTranslation = vec3.fromValues(0, 0, 0);
const defaultRotation = quat.fromValues(0, 0, 0, 1);
const defaultScaling = vec3.fromValues(1, 1, 1);
const tempParentRotationQuat = quat.create();
const tempParentRotationMat = mat4.create();
const tempCameraMat = mat4.create();
const tempTransformedPivotPoint = vec3.create();
const tempAxis = vec3.create();
const tempLockQuat = quat.create();
const tempLockMat = mat4.create();
const tempXAxis = vec3.create();
const tempCameraVec = vec3.create();
const tempCross0 = vec3.create();
const tempCross1 = vec3.create();
const tempPos = vec3.create();
const tempSum = vec3.create();
const tempVec3 = vec3.create();
const identifyMat3 = mat3.create();
const texCoordMat4 = mat4.create();
const texCoordMat3 = mat3.create();

// noinspection DuplicatedCode
export class ModelRenderer {
    vertexBuffer = [];
    normalBuffer = [];
    vertices = []; // Array per geoset for software skinning
    texCoordBuffer = [];
    indexBuffer = [];
    wireframeIndexBuffer = [];
    groupBuffer = [];
    skinWeightBuffer = [];
    tangentBuffer = [];

    /* @deprecated */
    model;

    /**
     * @param {MDX} mdx
     * @param model
     */
    constructor(mdx, model) {
        this.model = model;
        this.mdx = mdx;

        this.isHD = this.model.Geosets?.some(it => it.SkinWeights?.length > 0);

        this.shaderProgramLocations = {
            vertexPositionAttribute: null,
            normalsAttribute: null,
            textureCoordAttribute: null,
            groupAttribute: null,
            skinAttribute: null,
            weightAttribute: null,
            tangentAttribute: null,
            pMatrixUniform: null,
            mvMatrixUniform: null,
            samplerUniform: null,
            normalSamplerUniform: null,
            ormSamplerUniform: null,
            replaceableColorUniform: null,
            replaceableTypeUniform: null,
            discardAlphaLevelUniform: null,
            tVertexAnimUniform: null,
            nodesMatricesAttributes: null,
            lightPosUniform: null,
            cameraPosUniform: null,
        };
        this.skeletonShaderProgramLocations = {
            vertexPositionAttribute: null,
            colorAttribute: null,
            mvMatrixUniform: null,
            pMatrixUniform: null,
        };

        this.rendererData = {
            frame: 0,
            animation: null,
            animationInfo: null,
            globalSequencesFrames: [],
            rootNode: null,
            /** @deprecated */
            nodes: [],
            geosetAnims: [],
            geosetAlpha: [],
            materialLayerTextureID: [],
            teamColor: null,
            cameraPos: null,
            cameraQuat: null,
            textures: {},
        };
        this.rendererData.teamColor = vec3.fromValues(1, 0, 0);
        this.rendererData.cameraPos = vec3.create();
        this.rendererData.cameraQuat = quat.create();
        this.setSequence(0);
        this.rendererData.rootNode = {
            node: {},
            matrix: mat4.create(),
            childs: [],
        };


        console.log(this.model.Nodes);
        //console.log(this.mdx);

        for (const node of this.model.Nodes) {
            if (node) {
                this.rendererData.nodes[node.ObjectId] = {
                    node,
                    matrix: mat4.create(),
                    childs: [],
                };
            }
        }
        for (const node of this.model.Nodes) {
            if (node) {
                if (!node.Parent && node.Parent !== 0) this.rendererData.rootNode.childs.push(this.rendererData.nodes[node.ObjectId]);
                else this.rendererData.nodes[node.Parent].childs.push(this.rendererData.nodes[node.ObjectId]);
            }
        }
        if (this.model.GlobalSequences) {
            for (let i = 0; i < this.model.GlobalSequences.length; ++i) {
                this.rendererData.globalSequencesFrames[i] = 0;
            }
        }
        for (let i = 0; i < this.model.GeosetAnims.length; ++i) {
            this.rendererData.geosetAnims[this.model.GeosetAnims[i].GeosetId] = this.model.GeosetAnims[i];
        }
        for (let i = 0; i < this.model.Materials.length; ++i) {
            this.rendererData.materialLayerTextureID[i] = new Array(this.model.Materials[i].Layers.length);
        }
        this.interp = new ModelInterp(this.rendererData);
        this.particlesController = new ParticlesController(this.model, this.interp, this.rendererData);
        this.ribbonsController = new RibbonsController(this.model, this.interp, this.rendererData);
    }

    destroy() {
        if (this.particlesController) {
            this.particlesController.destroy();
            this.particlesController = null;
        }
        if (this.ribbonsController) {
            this.ribbonsController.destroy();
            this.ribbonsController = null;
        }
        if (this.skeletonShaderProgram) {
            if (this.skeletonVertexShader) {
                this.gl.detachShader(this.skeletonShaderProgram, this.skeletonVertexShader);
                this.gl.deleteShader(this.skeletonVertexShader);
                this.skeletonVertexShader = null;
            }
            if (this.skeletonFragmentShader) {
                this.gl.detachShader(this.skeletonShaderProgram, this.skeletonFragmentShader);
                this.gl.deleteShader(this.skeletonFragmentShader);
                this.skeletonFragmentShader = null;
            }
            this.gl.deleteProgram(this.skeletonShaderProgram);
            this.skeletonShaderProgram = null;
        }
        if (this.shaderProgram) {
            if (this.vertexShader) {
                this.gl.detachShader(this.shaderProgram, this.vertexShader);
                this.gl.deleteShader(this.vertexShader);
                this.vertexShader = null;
            }
            if (this.fragmentShader) {
                this.gl.detachShader(this.shaderProgram, this.fragmentShader);
                this.gl.deleteShader(this.fragmentShader);
                this.fragmentShader = null;
            }
            this.gl.deleteProgram(this.shaderProgram);
            this.shaderProgram = null;
        }
    }

    initGL(glContext) {
        this.gl = glContext;
        // Max bones + MV + P
        this.softwareSkinning = this.gl.getParameter(this.gl.MAX_VERTEX_UNIFORM_VECTORS) < 4 * (MAX_NODES + 2);
        this.anisotropicExt = this.gl.getExtension('EXT_texture_filter_anisotropic');
        this.initShaders();
        this.initBuffers();
        this.particlesController.initGL(glContext);
        this.ribbonsController.initGL(glContext);
    }

    /**
     * @param {Texture} texture
     * @param img
     */
    setTextureImage(texture, img) {
        this.rendererData.textures[texture.filename] = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.rendererData.textures[texture.filename]);
        // this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);
        this.setTextureParameters(texture, true);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }

    /**
     * @param {Texture} texture
     * @param imageData
     */
    setTextureImageData(texture, imageData) {
        this.rendererData.textures[texture.filename] = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.rendererData.textures[texture.filename]);
        // this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
        for (let i = 0; i < imageData.length; ++i) {
            this.gl.texImage2D(this.gl.TEXTURE_2D, i, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, imageData[i]);
        }
        this.setTextureParameters(texture, false);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }

    /**
     * @param {Texture} texture
     * @param format
     * @param imageData
     * @param ddsInfo
     */
    setTextureCompressedImage(texture, format, imageData, ddsInfo) {
        this.rendererData.textures[texture.filename] = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.rendererData.textures[texture.filename]);
        const view = new Uint8Array(imageData);
        let count = 1;
        for (let i = 1; i < ddsInfo.images.length; ++i) {
            const image = ddsInfo.images[i];
            if (image.shape.width >= 2 && image.shape.height >= 2) count = i + 1;
        }

        this.gl.texStorage2D(this.gl.TEXTURE_2D, count, format, ddsInfo.images[0].shape.width, ddsInfo.images[0].shape.height);
        for (let i = 0; i < count; ++i) {
            const image = ddsInfo.images[i];
            this.gl.compressedTexSubImage2D(
                this.gl.TEXTURE_2D,
                i,
                0,
                0,
                image.shape.width,
                image.shape.height,
                format,
                view.subarray(image.offset, image.offset + image.length),
            );
        }

        this.setTextureParameters(texture, true);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }

    setCamera(cameraPos, cameraQuat) {
        vec3.copy(this.rendererData.cameraPos, cameraPos);
        quat.copy(this.rendererData.cameraQuat, cameraQuat);
    }

    setSequence(index) {
        this.rendererData.animation = index;
        this.rendererData.animationInfo = this.model.Sequences[this.rendererData.animation];
        this.rendererData.frame = this.rendererData.animationInfo.Interval[0];
    }

    setTeamColor(color) {
        vec3.copy(this.rendererData.teamColor, color);
    }

    update(delta) {
        this.rendererData.frame += delta;
        if (this.rendererData.frame > this.rendererData.animationInfo.Interval[1]) {
            this.rendererData.frame = this.rendererData.animationInfo.Interval[0];
        }
        this.updateGlobalSequences(delta);
        this.updateNode(this.rendererData.rootNode);
        this.particlesController.update(delta);
        this.ribbonsController.update(delta);
        for (let i = 0; i < this.model.Geosets.length; ++i) {
            this.rendererData.geosetAlpha[i] = this.findAlpha(i);
        }
        for (let i = 0; i < this.rendererData.materialLayerTextureID.length; ++i) {
            for (let j = 0; j < this.rendererData.materialLayerTextureID[i].length; ++j) {
                this.updateLayerTextureId(i, j);
            }
        }
    }

    render(mvMatrix, pMatrix, {wireframe}) {
        this.gl.useProgram(this.shaderProgram);
        this.gl.uniformMatrix4fv(this.shaderProgramLocations.pMatrixUniform, false, pMatrix);
        this.gl.uniformMatrix4fv(this.shaderProgramLocations.mvMatrixUniform, false, mvMatrix);
        this.gl.enableVertexAttribArray(this.shaderProgramLocations.vertexPositionAttribute);
        this.gl.enableVertexAttribArray(this.shaderProgramLocations.normalsAttribute);
        this.gl.enableVertexAttribArray(this.shaderProgramLocations.textureCoordAttribute);
        if (this.isHD) {
            this.gl.enableVertexAttribArray(this.shaderProgramLocations.skinAttribute);
            this.gl.enableVertexAttribArray(this.shaderProgramLocations.weightAttribute);
            this.gl.enableVertexAttribArray(this.shaderProgramLocations.tangentAttribute);
        } else {
            if (!this.softwareSkinning) {
                this.gl.enableVertexAttribArray(this.shaderProgramLocations.groupAttribute);
            }
        }
        if (!this.softwareSkinning) {
            for (let j = 0; j < MAX_NODES; ++j) {
                if (this.rendererData.nodes[j]) {
                    this.gl.uniformMatrix4fv(
                        this.shaderProgramLocations.nodesMatricesAttributes[j],
                        false,
                        this.rendererData.nodes[j].matrix,
                    );
                }
            }
        }
        for (let i = 0; i < this.model.Geosets.length; ++i) {
            const geoset = this.model.Geosets[i];
            if (this.rendererData.geosetAlpha[i] < 1e-6) {
                continue;
            }
            if (geoset.LevelOfDetail > 0) {
                continue;
            }
            if (this.softwareSkinning) {
                this.generateGeosetVertices(i);
            }
            const materialID = geoset.MaterialID;
            const material = this.model.Materials[materialID];
            // Shader_HD_DefaultUnit
            if (this.isHD) {
                this.gl.uniform3fv(this.shaderProgramLocations.lightPosUniform, [1000, 1000, 1000]);
                // this.gl.uniform3fv(this.shaderProgramLocations.lightPosUniform, this.rendererData.cameraPos);
                this.gl.uniform3fv(this.shaderProgramLocations.cameraPosUniform, this.rendererData.cameraPos);
                this.setLayerPropsHD(materialID, material.Layers);
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer[i]);
                this.gl.vertexAttribPointer(this.shaderProgramLocations.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer[i]);
                this.gl.vertexAttribPointer(this.shaderProgramLocations.normalsAttribute, 3, this.gl.FLOAT, false, 0, 0);
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer[i]);
                this.gl.vertexAttribPointer(this.shaderProgramLocations.textureCoordAttribute, 2, this.gl.FLOAT, false, 0, 0);
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.skinWeightBuffer[i]);
                this.gl.vertexAttribPointer(this.shaderProgramLocations.skinAttribute, 4, this.gl.UNSIGNED_BYTE, false, 8, 0);
                this.gl.vertexAttribPointer(this.shaderProgramLocations.weightAttribute, 4, this.gl.UNSIGNED_BYTE, true, 8, 4);
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.tangentBuffer[i]);
                this.gl.vertexAttribPointer(this.shaderProgramLocations.tangentAttribute, 4, this.gl.FLOAT, false, 0, 0);
                if (wireframe && !this.wireframeIndexBuffer[i]) {
                    this.createWireframeBuffer(i);
                }
                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, wireframe ? this.wireframeIndexBuffer[i] : this.indexBuffer[i]);
                this.gl.drawElements(
                    wireframe ? this.gl.LINES : this.gl.TRIANGLES,
                    wireframe ? geoset.Faces.length * 2 : geoset.Faces.length,
                    this.gl.UNSIGNED_SHORT,
                    0,
                );
            } else {
                for (let j = 0; j < material.Layers.length; ++j) {
                    this.setLayerProps(material.Layers[j], this.rendererData.materialLayerTextureID[materialID][j]);
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer[i]);
                    this.gl.vertexAttribPointer(this.shaderProgramLocations.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer[i]);
                    this.gl.vertexAttribPointer(this.shaderProgramLocations.normalsAttribute, 3, this.gl.FLOAT, false, 0, 0);
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer[i]);
                    this.gl.vertexAttribPointer(this.shaderProgramLocations.textureCoordAttribute, 2, this.gl.FLOAT, false, 0, 0);
                    if (!this.softwareSkinning) {
                        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.groupBuffer[i]);
                        this.gl.vertexAttribPointer(this.shaderProgramLocations.groupAttribute, 4, this.gl.UNSIGNED_SHORT, false, 0, 0);
                    }
                    if (wireframe && !this.wireframeIndexBuffer[i]) {
                        this.createWireframeBuffer(i);
                    }
                    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, wireframe ? this.wireframeIndexBuffer[i] : this.indexBuffer[i]);
                    this.gl.drawElements(
                        wireframe ? this.gl.LINES : this.gl.TRIANGLES,
                        wireframe ? geoset.Faces.length * 2 : geoset.Faces.length,
                        this.gl.UNSIGNED_SHORT,
                        0,
                    );
                }
            }
        }
        this.gl.disableVertexAttribArray(this.shaderProgramLocations.vertexPositionAttribute);
        this.gl.disableVertexAttribArray(this.shaderProgramLocations.normalsAttribute);
        this.gl.disableVertexAttribArray(this.shaderProgramLocations.textureCoordAttribute);
        if (this.isHD) {
            this.gl.disableVertexAttribArray(this.shaderProgramLocations.skinAttribute);
            this.gl.disableVertexAttribArray(this.shaderProgramLocations.weightAttribute);
            this.gl.disableVertexAttribArray(this.shaderProgramLocations.tangentAttribute);
        } else {
            if (!this.softwareSkinning) {
                this.gl.disableVertexAttribArray(this.shaderProgramLocations.groupAttribute);
            }
        }
        this.particlesController.render(mvMatrix, pMatrix);
        this.ribbonsController.render(mvMatrix, pMatrix);
    }

    /**
     * @param mvMatrix
     * @param pMatrix
     * @param nodes Nodes to highlight. null means draw all
     */
    renderSkeleton(mvMatrix, pMatrix, nodes) {
        if (!this.skeletonShaderProgram) {
            this.skeletonShaderProgram = this.initSkeletonShaderProgram();
        }
        this.gl.disable(this.gl.BLEND);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.useProgram(this.skeletonShaderProgram);
        this.gl.uniformMatrix4fv(this.skeletonShaderProgramLocations.pMatrixUniform, false, pMatrix);
        this.gl.uniformMatrix4fv(this.skeletonShaderProgramLocations.mvMatrixUniform, false, mvMatrix);
        this.gl.enableVertexAttribArray(this.skeletonShaderProgramLocations.vertexPositionAttribute);
        this.gl.enableVertexAttribArray(this.skeletonShaderProgramLocations.colorAttribute);
        if (!this.skeletonVertexBuffer) {
            this.skeletonVertexBuffer = this.gl.createBuffer();
        }
        if (!this.skeletonColorBuffer) {
            this.skeletonColorBuffer = this.gl.createBuffer();
        }
        const coords = [];
        const colors = [];
        const line = (node0, node1) => {
            vec3.transformMat4(tempPos, node0.node.PivotPoint, node0.matrix);
            coords.push(tempPos[0], tempPos[1], tempPos[2]);
            vec3.transformMat4(tempPos, node1.node.PivotPoint, node1.matrix);
            coords.push(tempPos[0], tempPos[1], tempPos[2]);
            colors.push(0, 1, 0, 0, 0, 1);
        };
        const updateNode = node => {
            if ((node.node.Parent || node.node.Parent === 0) && (!nodes || nodes.includes(node.node.Name))) {
                line(node, this.rendererData.nodes[node.node.Parent]);
            }
            for (const child of node.childs) {
                updateNode(child);
            }
        };
        updateNode(this.rendererData.rootNode);
        const vertexBuffer = new Float32Array(coords);
        const colorBuffer = new Float32Array(colors);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.skeletonVertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexBuffer, this.gl.DYNAMIC_DRAW);
        this.gl.vertexAttribPointer(this.skeletonShaderProgramLocations.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.skeletonColorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, colorBuffer, this.gl.DYNAMIC_DRAW);
        this.gl.vertexAttribPointer(this.skeletonShaderProgramLocations.colorAttribute, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.gl.LINES, 0, vertexBuffer.length / 3);
        this.gl.disableVertexAttribArray(this.skeletonShaderProgramLocations.vertexPositionAttribute);
        this.gl.disableVertexAttribArray(this.skeletonShaderProgramLocations.colorAttribute);
    }

    initSkeletonShaderProgram() {
        const vertex = this.skeletonVertexShader = getShader(this.gl, skeletonVertexShader, this.gl.VERTEX_SHADER);
        const fragment = this.skeletonFragmentShader = getShader(this.gl, skeletonFragmentShader, this.gl.FRAGMENT_SHADER);
        const shaderProgram = this.gl.createProgram();
        this.gl.attachShader(shaderProgram, vertex);
        this.gl.attachShader(shaderProgram, fragment);
        this.gl.linkProgram(shaderProgram);
        if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
            alert('Could not initialise shaders');
        }
        this.gl.useProgram(shaderProgram);
        this.skeletonShaderProgramLocations.vertexPositionAttribute = this.gl.getAttribLocation(shaderProgram, 'aVertexPosition');
        this.skeletonShaderProgramLocations.colorAttribute = this.gl.getAttribLocation(shaderProgram, 'aColor');
        this.skeletonShaderProgramLocations.pMatrixUniform = this.gl.getUniformLocation(shaderProgram, 'uPMatrix');
        this.skeletonShaderProgramLocations.mvMatrixUniform = this.gl.getUniformLocation(shaderProgram, 'uMVMatrix');
        return shaderProgram;
    }

    generateGeosetVertices(geosetIndex) {
        const geoset = this.model.Geosets[geosetIndex];
        const buffer = this.vertices[geosetIndex];
        for (let i = 0; i < buffer.length; i += 3) {
            const index = i / 3;
            const group = geoset.Groups[geoset.VertexGroup[index]];
            vec3.set(tempPos, geoset.Vertices[i], geoset.Vertices[i + 1], geoset.Vertices[i + 2]);
            vec3.set(tempSum, 0, 0, 0);
            for (let j = 0; j < group.length; ++j) {
                vec3.add(tempSum, tempSum, vec3.transformMat4(tempVec3, tempPos, this.rendererData.nodes[group[j]].matrix));
            }
            vec3.scale(tempPos, tempSum, 1 / group.length);
            buffer[i] = tempPos[0];
            buffer[i + 1] = tempPos[1];
            buffer[i + 2] = tempPos[2];
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer[geosetIndex]);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, buffer, this.gl.DYNAMIC_DRAW);
    }

    /**
     * @param {Texture} texture
     * @param {boolean} hasMipmaps
     */
    setTextureParameters(texture, hasMipmaps) {
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, texture.wrapWidth ? this.gl.REPEAT : this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, texture.wrapHeight ? this.gl.REPEAT : this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, hasMipmaps ? this.gl.LINEAR_MIPMAP_NEAREST : this.gl.LINEAR);
        if (this.anisotropicExt) {
            const max = this.gl.getParameter(this.anisotropicExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
            this.gl.texParameterf(this.gl.TEXTURE_2D, this.anisotropicExt.TEXTURE_MAX_ANISOTROPY_EXT, max);
        }
    }

    updateLayerTextureId(materialId, layerId) {
        const TextureID = this.model.Materials[materialId].Layers[layerId].TextureID;
        if (typeof TextureID === 'number') {
            this.rendererData.materialLayerTextureID[materialId][layerId] = TextureID;
        } else {
            this.rendererData.materialLayerTextureID[materialId][layerId] = this.interp.num(TextureID);
        }
    }

    initShaders() {
        if (this.shaderProgram) {
            return;
        }
        let vertexShaderSource;
        if (this.isHD) vertexShaderSource = vertexShaderHDHardwareSkinning;
        else if (this.softwareSkinning) vertexShaderSource = vertexShaderSoftwareSkinning;
        else vertexShaderSource = vertexShaderHardwareSkinning;

        let fragmentShaderSource;
        if (this.isHD) fragmentShaderSource = fragmentShaderHD;
        else fragmentShaderSource = fragmentShader;

        const vertex = this.vertexShader = getShader(this.gl, vertexShaderSource, this.gl.VERTEX_SHADER);
        const fragment = this.fragmentShader = getShader(this.gl, fragmentShaderSource, this.gl.FRAGMENT_SHADER);
        const shaderProgram = this.shaderProgram = this.gl.createProgram();
        this.gl.attachShader(shaderProgram, vertex);
        this.gl.attachShader(shaderProgram, fragment);
        this.gl.linkProgram(shaderProgram);
        if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
            alert('Could not initialise shaders');
        }
        this.gl.useProgram(shaderProgram);
        this.shaderProgramLocations.vertexPositionAttribute = this.gl.getAttribLocation(shaderProgram, 'aVertexPosition');
        this.shaderProgramLocations.normalsAttribute = this.gl.getAttribLocation(shaderProgram, 'aNormal');
        this.shaderProgramLocations.textureCoordAttribute = this.gl.getAttribLocation(shaderProgram, 'aTextureCoord');
        if (this.isHD) {
            this.shaderProgramLocations.skinAttribute = this.gl.getAttribLocation(shaderProgram, 'aSkin');
            this.shaderProgramLocations.weightAttribute = this.gl.getAttribLocation(shaderProgram, 'aBoneWeight');
            this.shaderProgramLocations.tangentAttribute = this.gl.getAttribLocation(shaderProgram, 'aTangent');
        } else {
            if (!this.softwareSkinning) {
                this.shaderProgramLocations.groupAttribute = this.gl.getAttribLocation(shaderProgram, 'aGroup');
            }
        }
        this.shaderProgramLocations.pMatrixUniform = this.gl.getUniformLocation(shaderProgram, 'uPMatrix');
        this.shaderProgramLocations.mvMatrixUniform = this.gl.getUniformLocation(shaderProgram, 'uMVMatrix');
        this.shaderProgramLocations.samplerUniform = this.gl.getUniformLocation(shaderProgram, 'uSampler');
        this.shaderProgramLocations.replaceableColorUniform = this.gl.getUniformLocation(shaderProgram, 'uReplaceableColor');
        if (this.isHD) {
            this.shaderProgramLocations.normalSamplerUniform = this.gl.getUniformLocation(shaderProgram, 'uNormalSampler');
            this.shaderProgramLocations.ormSamplerUniform = this.gl.getUniformLocation(shaderProgram, 'uOrmSampler');
            this.shaderProgramLocations.lightPosUniform = this.gl.getUniformLocation(shaderProgram, 'uLightPos');
            this.shaderProgramLocations.cameraPosUniform = this.gl.getUniformLocation(shaderProgram, 'uCameraPos');
        } else {
            this.shaderProgramLocations.replaceableTypeUniform = this.gl.getUniformLocation(shaderProgram, 'uReplaceableType');
        }
        this.shaderProgramLocations.discardAlphaLevelUniform = this.gl.getUniformLocation(shaderProgram, 'uDiscardAlphaLevel');
        this.shaderProgramLocations.tVertexAnimUniform = this.gl.getUniformLocation(shaderProgram, 'uTVextexAnim');
        if (!this.softwareSkinning) {
            this.shaderProgramLocations.nodesMatricesAttributes = [];
            for (let i = 0; i < MAX_NODES; ++i) {
                this.shaderProgramLocations.nodesMatricesAttributes[i] = this.gl.getUniformLocation(shaderProgram, `uNodesMatrices[${i}]`);
            }
        }
    }

    createWireframeBuffer(index) {
        const faces = this.model.Geosets[index].Faces;
        const lines = new Uint16Array(faces.length * 2);
        for (let i = 0; i < faces.length; i += 3) {
            lines[i * 2] = faces[i];
            lines[i * 2 + 1] = faces[i + 1];
            lines[i * 2 + 2] = faces[i + 1];
            lines[i * 2 + 3] = faces[i + 2];
            lines[i * 2 + 4] = faces[i + 2];
            lines[i * 2 + 5] = faces[i];
        }
        this.wireframeIndexBuffer[index] = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.wireframeIndexBuffer[index]);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, lines, this.gl.STATIC_DRAW);
    }

    initBuffers() {
        for (let i = 0; i < this.model.Geosets.length; ++i) {
            const geoset = this.model.Geosets[i];
            if (geoset.LevelOfDetail > 0) {
                continue;
            }
            this.vertexBuffer[i] = this.gl.createBuffer();
            if (this.softwareSkinning) this.vertices[i] = new Float32Array(geoset.Vertices.length);
            else {
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer[i]);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, geoset.Vertices, this.gl.STATIC_DRAW);
            }
            this.normalBuffer[i] = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer[i]);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, geoset.Normals, this.gl.STATIC_DRAW);
            this.texCoordBuffer[i] = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer[i]);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, geoset.TVertices[0], this.gl.STATIC_DRAW);
            if (this.isHD) {
                this.skinWeightBuffer[i] = this.gl.createBuffer();
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.skinWeightBuffer[i]);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, geoset.SkinWeights, this.gl.STATIC_DRAW);
                this.tangentBuffer[i] = this.gl.createBuffer();
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.tangentBuffer[i]);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, geoset.Tangents, this.gl.STATIC_DRAW);
            } else {
                if (!this.softwareSkinning) {
                    this.groupBuffer[i] = this.gl.createBuffer();
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.groupBuffer[i]);
                    const buffer = new Uint16Array(geoset.VertexGroup.length * 4);
                    for (let j = 0; j < buffer.length; j += 4) {
                        const index = j / 4;
                        const group = geoset.Groups[geoset.VertexGroup[index]];
                        buffer[j] = group[0];
                        buffer[j + 1] = group.length > 1 ? group[1] : MAX_NODES;
                        buffer[j + 2] = group.length > 2 ? group[2] : MAX_NODES;
                        buffer[j + 3] = group.length > 3 ? group[3] : MAX_NODES;
                    }
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, buffer, this.gl.STATIC_DRAW);
                }
            }
            this.indexBuffer[i] = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer[i]);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, geoset.Faces, this.gl.STATIC_DRAW);
        }
    }

    /*private resetGlobalSequences (): void {
        for (let i = 0; i < this.rendererData.globalSequencesFrames.length; ++i) {
            this.rendererData.globalSequencesFrames[i] = 0;
        }
    }*/
    updateGlobalSequences(delta) {
        for (let i = 0; i < this.rendererData.globalSequencesFrames.length; ++i) {
            this.rendererData.globalSequencesFrames[i] += delta;
            if (this.rendererData.globalSequencesFrames[i] > this.model.GlobalSequences[i]) {
                this.rendererData.globalSequencesFrames[i] = 0;
            }
        }
    }

    updateNode(node) {
        const translationRes = this.interp.vec3(translation, node.node.Translation);
        const rotationRes = this.interp.quat(rotation, node.node.Rotation);
        const scalingRes = this.interp.vec3(scaling, node.node.Scaling);
        if (!translationRes && !rotationRes && !scalingRes) {
            mat4.identity(node.matrix);
        } else if (translationRes && !rotationRes && !scalingRes) {
            mat4.fromTranslation(node.matrix, translationRes);
        } else if (!translationRes && rotationRes && !scalingRes) {
            mat4fromRotationOrigin(node.matrix, rotationRes, node.node.PivotPoint);
        } else {
            mat4.fromRotationTranslationScaleOrigin(
                node.matrix,
                rotationRes || defaultRotation,
                translationRes || defaultTranslation,
                scalingRes || defaultScaling,
                node.node.PivotPoint,
            );
        }
        if (node.node.Parent || node.node.Parent === 0) {
            mat4.mul(node.matrix, this.rendererData.nodes[node.node.Parent].matrix, node.matrix);
        }
        const billboardedLock =
            node.node.Flags & NodeFlags.BillboardedLockX ||
            node.node.Flags & NodeFlags.BillboardedLockY ||
            node.node.Flags & NodeFlags.BillboardedLockZ;
        if (node.node.Flags & NodeFlags.Billboarded) {
            vec3.transformMat4(tempTransformedPivotPoint, node.node.PivotPoint, node.matrix);
            if (node.node.Parent || node.node.Parent === 0) {
                // cancel parent rotation from PivotPoint
                mat4.getRotation(tempParentRotationQuat, this.rendererData.nodes[node.node.Parent].matrix);
                quat.invert(tempParentRotationQuat, tempParentRotationQuat);
                mat4fromRotationOrigin(tempParentRotationMat, tempParentRotationQuat, tempTransformedPivotPoint);
                mat4.mul(node.matrix, tempParentRotationMat, node.matrix);
            }
            // rotate to camera
            mat4fromRotationOrigin(tempCameraMat, this.rendererData.cameraQuat, tempTransformedPivotPoint);
            mat4.mul(node.matrix, tempCameraMat, node.matrix);
        } else if (billboardedLock) {
            vec3.transformMat4(tempTransformedPivotPoint, node.node.PivotPoint, node.matrix);
            vec3.copy(tempAxis, node.node.PivotPoint);
            // todo BillboardedLockX ?
            if (node.node.Flags & NodeFlags.BillboardedLockX) {
                tempAxis[0] += 1;
            } else if (node.node.Flags & NodeFlags.BillboardedLockY) {
                tempAxis[1] += 1;
            } else if (node.node.Flags & NodeFlags.BillboardedLockZ) {
                tempAxis[2] += 1;
            }
            vec3.transformMat4(tempAxis, tempAxis, node.matrix);
            vec3.sub(tempAxis, tempAxis, tempTransformedPivotPoint);
            vec3.set(tempXAxis, 1, 0, 0);
            vec3.add(tempXAxis, tempXAxis, node.node.PivotPoint);
            vec3.transformMat4(tempXAxis, tempXAxis, node.matrix);
            vec3.sub(tempXAxis, tempXAxis, tempTransformedPivotPoint);
            vec3.set(tempCameraVec, -1, 0, 0);
            vec3.transformQuat(tempCameraVec, tempCameraVec, this.rendererData.cameraQuat);
            vec3.cross(tempCross0, tempAxis, tempCameraVec);
            vec3.cross(tempCross1, tempAxis, tempCross0);
            vec3.normalize(tempCross1, tempCross1);
            quat.rotationTo(tempLockQuat, tempXAxis, tempCross1);
            mat4fromRotationOrigin(tempLockMat, tempLockQuat, tempTransformedPivotPoint);
            mat4.mul(node.matrix, tempLockMat, node.matrix);
        }
        for (const child of node.childs) {
            this.updateNode(child);
        }
    }

    findAlpha(geosetId) {
        const geosetAnim = this.rendererData.geosetAnims[geosetId];
        if (!geosetAnim || geosetAnim.Alpha === undefined) return 1;
        if (typeof geosetAnim.Alpha === 'number') return geosetAnim.Alpha;
        const interpRes = this.interp.num(geosetAnim.Alpha);
        if (interpRes === null) return 1;
        return interpRes;
    }

    setLayerProps(layer, textureID) {
        const texture = this.model.Textures[textureID];
        if (layer.Shading & LayerShading.TwoSided) this.gl.disable(this.gl.CULL_FACE);
        else this.gl.enable(this.gl.CULL_FACE);
        if (layer.FilterMode === FilterMode.Transparent) {
            this.gl.uniform1f(this.shaderProgramLocations.discardAlphaLevelUniform, 0.75);
        } else {
            this.gl.uniform1f(this.shaderProgramLocations.discardAlphaLevelUniform, 0);
        }
        if (layer.FilterMode === FilterMode.None) {
            this.gl.disable(this.gl.BLEND);
            this.gl.enable(this.gl.DEPTH_TEST);
            // this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
            this.gl.depthMask(true);
        } else if (layer.FilterMode === FilterMode.Transparent) {
            this.gl.enable(this.gl.BLEND);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
            this.gl.depthMask(true);
        } else if (layer.FilterMode === FilterMode.Blend) {
            this.gl.enable(this.gl.BLEND);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
            this.gl.depthMask(false);
        } else if (layer.FilterMode === FilterMode.Additive) {
            this.gl.enable(this.gl.BLEND);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.blendFunc(this.gl.SRC_COLOR, this.gl.ONE);
            this.gl.depthMask(false);
        } else if (layer.FilterMode === FilterMode.AddAlpha) {
            this.gl.enable(this.gl.BLEND);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
            this.gl.depthMask(false);
        } else if (layer.FilterMode === FilterMode.Modulate) {
            this.gl.enable(this.gl.BLEND);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.blendFuncSeparate(this.gl.ZERO, this.gl.SRC_COLOR, this.gl.ZERO, this.gl.ONE);
            this.gl.depthMask(false);
        } else if (layer.FilterMode === FilterMode.Modulate2x) {
            this.gl.enable(this.gl.BLEND);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.blendFuncSeparate(this.gl.DST_COLOR, this.gl.SRC_COLOR, this.gl.ZERO, this.gl.ONE);
            this.gl.depthMask(false);
        }
        if (texture.Image) {
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.rendererData.textures[texture.Image]);
            this.gl.uniform1i(this.shaderProgramLocations.samplerUniform, 0);
            this.gl.uniform1f(this.shaderProgramLocations.replaceableTypeUniform, 0);
        } else if (texture.ReplaceableId === 1 || texture.ReplaceableId === 2) {
            this.gl.uniform3fv(this.shaderProgramLocations.replaceableColorUniform, this.rendererData.teamColor);
            this.gl.uniform1f(this.shaderProgramLocations.replaceableTypeUniform, texture.ReplaceableId);
        }
        if (layer.Shading & LayerShading.NoDepthTest) {
            this.gl.disable(this.gl.DEPTH_TEST);
        }
        if (layer.Shading & LayerShading.NoDepthSet) {
            this.gl.depthMask(false);
        }
        if (typeof layer.TVertexAnimId === 'number') {
            const anim = this.rendererData.model.TextureAnims[layer.TVertexAnimId];
            const translationRes = this.interp.vec3(translation, anim.Translation);
            const rotationRes = this.interp.quat(rotation, anim.Rotation);
            const scalingRes = this.interp.vec3(scaling, anim.Scaling);
            mat4.fromRotationTranslationScale(
                texCoordMat4,
                rotationRes || defaultRotation,
                translationRes || defaultTranslation,
                scalingRes || defaultScaling,
            );
            mat3.set(
                texCoordMat3,
                texCoordMat4[0],
                texCoordMat4[1],
                0,
                texCoordMat4[4],
                texCoordMat4[5],
                0,
                texCoordMat4[12],
                texCoordMat4[13],
                0,
            );
            this.gl.uniformMatrix3fv(this.shaderProgramLocations.tVertexAnimUniform, false, texCoordMat3);
        } else {
            this.gl.uniformMatrix3fv(this.shaderProgramLocations.tVertexAnimUniform, false, identifyMat3);
        }
    }

    setLayerPropsHD(materialID, layers) {
        const baseLayer = layers[0];
        const textures = this.rendererData.materialLayerTextureID[materialID];
        const diffuseTextureID = textures[0];
        const diffuseTexture = this.model.Textures[diffuseTextureID];
        const normalTextureID = textures[1];
        const normalTexture = this.model.Textures[normalTextureID];
        const ormTextureID = textures[2];
        const ormTexture = this.model.Textures[ormTextureID];
        // const emissiveTextureID = textures[3];
        // const emissiveTexture = this.model.Textures[emissiveTextureID];
        // const teamColorTextureID = textures[4];
        // const teamColorTexture = this.model.Textures[teamColorTextureID];
        // const envTextureID = textures[5];
        // const envTexture = this.model.Textures[envTextureID];
        if (baseLayer.Shading & LayerShading.TwoSided) {
            this.gl.disable(this.gl.CULL_FACE);
        } else {
            this.gl.enable(this.gl.CULL_FACE);
        }
        if (baseLayer.FilterMode === FilterMode.Transparent) {
            this.gl.uniform1f(this.shaderProgramLocations.discardAlphaLevelUniform, 0.75);
        } else {
            this.gl.uniform1f(this.shaderProgramLocations.discardAlphaLevelUniform, 0);
        }
        if (baseLayer.FilterMode === FilterMode.None) {
            this.gl.disable(this.gl.BLEND);
            this.gl.enable(this.gl.DEPTH_TEST);
            // this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
            this.gl.depthMask(true);
        } else if (baseLayer.FilterMode === FilterMode.Transparent) {
            this.gl.enable(this.gl.BLEND);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
            this.gl.depthMask(true);
        } else if (baseLayer.FilterMode === FilterMode.Blend) {
            this.gl.enable(this.gl.BLEND);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
            this.gl.depthMask(false);
        } else if (baseLayer.FilterMode === FilterMode.Additive) {
            this.gl.enable(this.gl.BLEND);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.blendFunc(this.gl.SRC_COLOR, this.gl.ONE);
            this.gl.depthMask(false);
        } else if (baseLayer.FilterMode === FilterMode.AddAlpha) {
            this.gl.enable(this.gl.BLEND);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
            this.gl.depthMask(false);
        } else if (baseLayer.FilterMode === FilterMode.Modulate) {
            this.gl.enable(this.gl.BLEND);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.blendFuncSeparate(this.gl.ZERO, this.gl.SRC_COLOR, this.gl.ZERO, this.gl.ONE);
            this.gl.depthMask(false);
        } else if (baseLayer.FilterMode === FilterMode.Modulate2x) {
            this.gl.enable(this.gl.BLEND);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.blendFuncSeparate(this.gl.DST_COLOR, this.gl.SRC_COLOR, this.gl.ZERO, this.gl.ONE);
            this.gl.depthMask(false);
        }
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.rendererData.textures[diffuseTexture.Image]);
        this.gl.uniform1i(this.shaderProgramLocations.samplerUniform, 0);
        if (baseLayer.Shading & LayerShading.NoDepthTest) {
            this.gl.disable(this.gl.DEPTH_TEST);
        }
        if (baseLayer.Shading & LayerShading.NoDepthSet) {
            this.gl.depthMask(false);
        }
        if (typeof baseLayer.TVertexAnimId === 'number') {
            const anim = this.rendererData.model.TextureAnims[baseLayer.TVertexAnimId];
            const translationRes = this.interp.vec3(translation, anim.Translation);
            const rotationRes = this.interp.quat(rotation, anim.Rotation);
            const scalingRes = this.interp.vec3(scaling, anim.Scaling);
            mat4.fromRotationTranslationScale(
                texCoordMat4,
                rotationRes || defaultRotation,
                translationRes || defaultTranslation,
                scalingRes || defaultScaling,
            );
            mat3.set(
                texCoordMat3,
                texCoordMat4[0],
                texCoordMat4[1],
                0,
                texCoordMat4[4],
                texCoordMat4[5],
                0,
                texCoordMat4[12],
                texCoordMat4[13],
                0,
            );
            this.gl.uniformMatrix3fv(this.shaderProgramLocations.tVertexAnimUniform, false, texCoordMat3);
        } else {
            this.gl.uniformMatrix3fv(this.shaderProgramLocations.tVertexAnimUniform, false, identifyMat3);
        }
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.rendererData.textures[normalTexture.Image]);
        this.gl.uniform1i(this.shaderProgramLocations.normalSamplerUniform, 1);
        this.gl.activeTexture(this.gl.TEXTURE2);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.rendererData.textures[ormTexture.Image]);
        this.gl.uniform1i(this.shaderProgramLocations.ormSamplerUniform, 2);
        this.gl.uniform3fv(this.shaderProgramLocations.replaceableColorUniform, this.rendererData.teamColor);
    }
}
