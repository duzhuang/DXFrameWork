[**SoundModule API 文档**](../README.md)

***

[SoundModule API 文档](../README.md) / default

# Class: default

Defined in: SoundModule.ts:6

## Implements

- `default`

## Constructors

### Constructor

> **new default**(): `SoundModule`

Defined in: SoundModule.ts:28

#### Returns

`SoundModule`

## Accessors

### effectVolume

#### Get Signature

> **get** **effectVolume**(): `number`

Defined in: SoundModule.ts:197

获取音效音量

##### Returns

`number`

***

### isEffectOn

#### Get Signature

> **get** **isEffectOn**(): `boolean`

Defined in: SoundModule.ts:183

获取音效是否开启

##### Returns

`boolean`

***

### isMusicOn

#### Get Signature

> **get** **isMusicOn**(): `boolean`

Defined in: SoundModule.ts:176

获取音乐是否开启

##### Returns

`boolean`

***

### musicVolume

#### Get Signature

> **get** **musicVolume**(): `number`

Defined in: SoundModule.ts:190

获取音乐音量

##### Returns

`number`

***

### instance

#### Get Signature

> **get** `static` **instance**(): `SoundModule`

Defined in: SoundModule.ts:8

全局单例

##### Returns

`SoundModule`

## Methods

### onDestroy()

> **onDestroy**(): `void`

Defined in: SoundModule.ts:57

销毁阶段（场景切换或热重载前调用）

#### Returns

`void`

#### Implementation of

`IModule.onDestroy`

***

### onInit()

> **onInit**(): `void`

Defined in: SoundModule.ts:33

初始化阶段（可在此读取配置）

#### Returns

`void`

#### Implementation of

`IModule.onInit`

***

### onStart()

> **onStart**(): `void`

Defined in: SoundModule.ts:47

启动阶段（场景启动后调用）

#### Returns

`void`

#### Implementation of

`IModule.onStart`

***

### onUpdate()

> **onUpdate**(`dt`): `void`

Defined in: SoundModule.ts:52

每帧更新（如果你需要在 update 里做额外逻辑可实现）

#### Parameters

##### dt

`number`

#### Returns

`void`

#### Implementation of

`IModule.onUpdate`

***

### pause()

> **pause**(`soundType`): `void`

Defined in: SoundModule.ts:126

暂停

#### Parameters

##### soundType

`SoundType`

#### Returns

`void`

***

### play()

> **play**(`config`): `void`

Defined in: SoundModule.ts:102

播放音乐

#### Parameters

##### config

`ISoundConfig`

#### Returns

`void`

***

### resume()

> **resume**(`soundType`): `void`

Defined in: SoundModule.ts:138

恢复

#### Parameters

##### soundType

`SoundType`

#### Returns

`void`

***

### setEffectVolume()

> **setEffectVolume**(`volume`): `void`

Defined in: SoundModule.ts:163

设置音效音量

#### Parameters

##### volume

`number`

音量

#### Returns

`void`

***

### setMusicVolume()

> **setMusicVolume**(`volume`): `void`

Defined in: SoundModule.ts:150

设置音乐音量

#### Parameters

##### volume

`number`

音量

#### Returns

`void`

***

### switchEffect()

> **switchEffect**(`isOn`): `void`

Defined in: SoundModule.ts:85

切换音效开关

#### Parameters

##### isOn

`boolean`

true:开启 false: 关闭

#### Returns

`void`

***

### switchMusic()

> **switchMusic**(`isOn`): `void`

Defined in: SoundModule.ts:72

切换音乐开关

#### Parameters

##### isOn

`boolean`

true:开启 false: 关闭

#### Returns

`void`
