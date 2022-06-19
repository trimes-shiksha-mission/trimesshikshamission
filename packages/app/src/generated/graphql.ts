import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Hello = {
  __typename?: 'Hello';
  id: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  verifyNumber: Scalars['String'];
};


export type MutationVerifyNumberArgs = {
  number: Scalars['Float'];
  otp: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  checkVerifiedNumber: Scalars['Boolean'];
  hello: Array<Hello>;
};


export type QueryCheckVerifiedNumberArgs = {
  number: Scalars['Float'];
};

export type CheckVerifiedNumberQueryVariables = Exact<{
  number: Scalars['Float'];
}>;


export type CheckVerifiedNumberQuery = { __typename?: 'Query', checkVerifiedNumber: boolean };

export type VerifyNumberMutationVariables = Exact<{
  otp: Scalars['Float'];
  number: Scalars['Float'];
}>;


export type VerifyNumberMutation = { __typename?: 'Mutation', verifyNumber: string };


export const CheckVerifiedNumberDocument = gql`
    query checkVerifiedNumber($number: Float!) {
  checkVerifiedNumber(number: $number)
}
    `;

/**
 * __useCheckVerifiedNumberQuery__
 *
 * To run a query within a React component, call `useCheckVerifiedNumberQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckVerifiedNumberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckVerifiedNumberQuery({
 *   variables: {
 *      number: // value for 'number'
 *   },
 * });
 */
export function useCheckVerifiedNumberQuery(baseOptions: Apollo.QueryHookOptions<CheckVerifiedNumberQuery, CheckVerifiedNumberQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CheckVerifiedNumberQuery, CheckVerifiedNumberQueryVariables>(CheckVerifiedNumberDocument, options);
      }
export function useCheckVerifiedNumberLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CheckVerifiedNumberQuery, CheckVerifiedNumberQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CheckVerifiedNumberQuery, CheckVerifiedNumberQueryVariables>(CheckVerifiedNumberDocument, options);
        }
export type CheckVerifiedNumberQueryHookResult = ReturnType<typeof useCheckVerifiedNumberQuery>;
export type CheckVerifiedNumberLazyQueryHookResult = ReturnType<typeof useCheckVerifiedNumberLazyQuery>;
export type CheckVerifiedNumberQueryResult = Apollo.QueryResult<CheckVerifiedNumberQuery, CheckVerifiedNumberQueryVariables>;
export const VerifyNumberDocument = gql`
    mutation verifyNumber($otp: Float!, $number: Float!) {
  verifyNumber(otp: $otp, number: $number)
}
    `;
export type VerifyNumberMutationFn = Apollo.MutationFunction<VerifyNumberMutation, VerifyNumberMutationVariables>;

/**
 * __useVerifyNumberMutation__
 *
 * To run a mutation, you first call `useVerifyNumberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyNumberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyNumberMutation, { data, loading, error }] = useVerifyNumberMutation({
 *   variables: {
 *      otp: // value for 'otp'
 *      number: // value for 'number'
 *   },
 * });
 */
export function useVerifyNumberMutation(baseOptions?: Apollo.MutationHookOptions<VerifyNumberMutation, VerifyNumberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyNumberMutation, VerifyNumberMutationVariables>(VerifyNumberDocument, options);
      }
export type VerifyNumberMutationHookResult = ReturnType<typeof useVerifyNumberMutation>;
export type VerifyNumberMutationResult = Apollo.MutationResult<VerifyNumberMutation>;
export type VerifyNumberMutationOptions = Apollo.BaseMutationOptions<VerifyNumberMutation, VerifyNumberMutationVariables>;