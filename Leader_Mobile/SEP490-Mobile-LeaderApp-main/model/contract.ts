export interface Contract {
    servicePackage:{
        name: string
        description: string
        numOfRequest: number
        policy: string
        imageUrl: string
        price: number
    }
    customer:{
        accountId: string
        fullName: string
        email: string
        phoneNumber: string
        avatarUrl: string
        dateOfBirth: string;
    }
    contractId: string
    fileUrl: string
    purchaseTime: string
    orderCode: number | null
    isOnlinePayment: boolean
    remainingNumOfRequests: number
    // ServicePackagePrices:{
    //     PriceByDate: number
    // }
}