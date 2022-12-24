export type userResponse = {
    id: string,
    username: string,
    password: string,
    accountId: string
}

export type userDTO = {
    userName: string,
    password: string
}

export type transactionDTO = {
    token: string | undefined, 
    userName: string,
    value: string
}

export type userTransaction = {
    id: string,
    userName: string,
    password?: string,
    account: {
        id: string,
        balance: number,
    }
}

export type filterDTO = {
    date: string,
    transact: string,
}
