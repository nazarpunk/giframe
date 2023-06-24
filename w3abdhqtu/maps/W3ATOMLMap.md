```regexp
constant\s+[a-z]+\s+[A-Z]+_[A-Z]+_
```

# ConvertAbilityIntegerField

```regexp
([A-Z_0-9]+)\s+=\s+ConvertAbilityIntegerField\('([a-zA-Z0-9]+)'\)
```

$2 : {type:0, name:'$1'},

# ConvertAbilityBooleanField

```regexp
([A-Z_0-9]+)\s+=\s+ConvertAbilityBooleanField\('([a-zA-Z0-9]+)'\)
```

$2 : {type:0, name:'$1 (boolean)'},

# ConvertAbilityBooleanLevelField

```regexp
([A-Z_0-9]+)\s+=\s+ConvertAbilityBooleanLevelField\('([a-zA-Z0-9]+)'\)
```

$2 : {type:0, name:'$1 (boolean)', level: true},

# ConvertAbilityIntegerLevelField

```regexp
([A-Z_0-9]+)\s+=\s+ConvertAbilityIntegerLevelField\('([a-zA-Z0-9]+)'\)
```

$2 : {type:0, name:'$1', level: true},

# ConvertAbilityRealLevelField

```regexp
([A-Z_0-9]+)\s+=\s+ConvertAbilityRealLevelField\('([a-zA-Z0-9]+)'\)
```

$2 : {type:1, name:'$1', level: true},

# ConvertAbilityStringField

```regexp
([A-Z_0-9]+)\s+=\s+ConvertAbilityStringField\('([a-zA-Z0-9]+)'\)
```

$2 : {type:3, name:'$1', multiline:true},

# ConvertAbilityStringField

```regexp
([A-Z_0-9]+)\s+=\s+ConvertAbilityStringLevelField\('([a-zA-Z0-9]+)'\)
```

$2 : {type:3, name:'$1', level: true, multiline:true},
