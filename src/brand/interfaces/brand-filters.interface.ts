export interface BrandFilters {
    name?: {
        $regex: string,
        $options: string
    },
    isActive: boolean
}