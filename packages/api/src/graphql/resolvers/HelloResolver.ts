import { Hello } from '@trimes-shiksha/entity'
import { Query, Resolver } from 'type-graphql'

@Resolver()
export class HelloResolver {
  @Query(() => [Hello])
  async hello(): Promise<Hello[]> {
    return await Hello.find()
  }
}
