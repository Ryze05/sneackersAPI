export interface SneakerFilters {
    model?: {
        $regex: string,
        $options: string
    },
    brand?: {
        $regex: string,
        $options: string
    },
    color?: string,
    isLimitedEdition?: boolean,
    size?: number,
    price?: {
        $gte?: number,
        $lte?: number
    },
    isActive: boolean
}