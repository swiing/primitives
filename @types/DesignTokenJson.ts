// TODO: add all tokens from w3c specs
type DesignTokenTypes = "color" | "dimension" | "shadow" | "fontFamily" | "fontWeight" | "typography"

type GenericDesignTokenValue = string | number

type GenericDesignTokenDefinition = {
  $value: GenericDesignTokenValue,
  $type: DesignTokenTypes,
  $description?: string,
  deprecated?: string
}

type ColorDesignTokenDefinition = GenericDesignTokenDefinition & {
  $value: string,
  $type: "color",
  alpha?: number
}

type DesignTokenDefinition = ColorDesignTokenDefinition | GenericDesignTokenDefinition

type DesignTokenGroup = {
  [name: string]: DesignTokenDefinition | DesignTokenGroup
}

export type DesignTokenJson = {[name: string]: DesignTokenGroup}

const test: DesignTokenJson = {
  "color": {
    "ansi": {
      "black": {
        "$value": "{base.color.scale.gray.9}",
        "$type": "color"
      },
      "blackBright": {
        "$value": "{base.color.scale.gray.6}",
        "$type": "color"
      },
    },
    "white": {
      "$value": "{base.color.scale.gray.5}",
      "$type": "color",
      user: {
        "$value": "{base.color.scale.gray.6}",
        "$type": "color"
      }
    },
  }
}