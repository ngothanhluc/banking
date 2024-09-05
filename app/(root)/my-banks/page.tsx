import BankCard from '@/components/BankCard'
import HeaderBox from '@/components/HeaderBox'
import { getAccount, getAccounts } from '@/lib/actions/bank.action'
import { getLoggedInUser } from '@/lib/actions/user.action'

const MyBanks = async ({ searchParams: { id, page } }: SearchParamProps) => {
    const currentPage = Number(page as string) || 1
    const loggedIn = await getLoggedInUser()
    const accounts = await getAccounts({ userId: loggedIn?.$id })

    if (!accounts) return
    const accountsData = accounts.data
    const appwriteItemId = (id as string) || accountsData?.[0]?.appwriteItemId

    const account = await getAccount({ appwriteItemId })
    return (
        <section className="flex">
            <div className="my-banks">
                <HeaderBox
                    title="My Banks Accounts"
                    subtext="Effortlessly manage your banking activities"
                    type="title"
                    user="Guest"
                />
                <div className="space-y-4">
                    <h2 className="header-2">Your cards</h2>
                    <div className="flex flex-wrap gap-6">
                        {accounts &&
                            accounts?.data?.map((account: any) => (
                                <BankCard
                                    account={account}
                                    key={account.id}
                                    userName={loggedIn?.firstName}
                                    showBalance
                                />
                            ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MyBanks
