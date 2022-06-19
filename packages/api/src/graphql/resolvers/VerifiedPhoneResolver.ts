import { VerifiedPhone } from '@trimes-shiksha/entity'
import { Arg, Mutation, Query, Resolver } from 'type-graphql'

@Resolver()
export class VerifiedPhoneResolver {
  @Query(() => Boolean)
  async checkVerifiedNumber(@Arg('number') number: number): Promise<boolean> {
    const phone = await VerifiedPhone.findOne({ where: { phone: number } })
    if (phone && phone.isVerified) {
      return true
    }
    return false
  }

  @Mutation(() => String)
  async verifyNumber(
    @Arg('number') number: number,
    @Arg('otp') otp: number
  ): Promise<string> {
    //TODO! OTP verification has to be done here
    otp

    try {
      await VerifiedPhone.create({
        phone: number,
        isVerified: true
      }).save()
      return 'Verified'
    } catch (e) {
      return ''
    }
  }
}
