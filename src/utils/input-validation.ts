import type { FormatType, StyleType } from '../types/types.global'

const SUPPORTED_REGIONS = ['eu', 'na', 'ap', 'kr', 'br', 'latam'] as const
export type SupportedRegion = (typeof SUPPORTED_REGIONS)[number]
const REGION_SET = new Set<SupportedRegion>(SUPPORTED_REGIONS)

export const validateRegion = (region: string): region is SupportedRegion => {
  if (!region || typeof region !== 'string') {
    return false
  }

  const normalizedRegion = region.toLowerCase().trim()
  return REGION_SET.has(normalizedRegion as SupportedRegion)
}

const stringRegex = /^[\p{L}\p{N}\s]+$/u

export const validateString = (str: string): boolean => {
  if (!str || typeof str !== 'string') {
    return false
  }
  return stringRegex.test(str)
}

export const validateStyle = (style: string | undefined): boolean => {
  if (!style) {
    return true
  }
  const validStyles: StyleType[] = ['minimal', 'peak', 'rank']
  return validStyles.includes(style as StyleType)
}

export const validateFormat = (format: string | undefined): boolean => {
  if (!format) {
    return true
  }
  const validFormats: FormatType[] = ['text']
  return validFormats.includes(format as FormatType)
}
