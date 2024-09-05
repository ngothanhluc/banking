import HeaderBox from '@/components/HeaderBox'
import PaymentTransferForm from '@/components/PaymentTransferForm'
import { getAccounts } from '@/lib/actions/bank.action'
import { getLoggedInUser } from '@/lib/actions/user.action'

const Transfer = async () => {
    const loggedIn = await getLoggedInUser()
    const accounts = await getAccounts({ userId: loggedIn?.$id })

    if (!accounts) return
    const accountsData = accounts.data

    return (
        <section className="payment-transfer">
            <HeaderBox
                title="Payment Transfer"
                subtext="Please enter the details of the recipient and the amount you want to transfer."
                type="title"
                user="Guest"
            />
            <section className="" size-full pt-5>
                <PaymentTransferForm accounts={accountsData} />
            </section>
        </section>
    )
}

export default Transfer
