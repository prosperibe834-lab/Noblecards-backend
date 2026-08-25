
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model PendingRegistration
 * 
 */
export type PendingRegistration = $Result.DefaultSelection<Prisma.$PendingRegistrationPayload>
/**
 * Model PasswordResetChallenge
 * 
 */
export type PasswordResetChallenge = $Result.DefaultSelection<Prisma.$PasswordResetChallengePayload>
/**
 * Model RefreshSession
 * 
 */
export type RefreshSession = $Result.DefaultSelection<Prisma.$RefreshSessionPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.PrismaClientConstructorArgs<ClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pendingRegistration`: Exposes CRUD operations for the **PendingRegistration** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PendingRegistrations
    * const pendingRegistrations = await prisma.pendingRegistration.findMany()
    * ```
    */
  get pendingRegistration(): Prisma.PendingRegistrationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.passwordResetChallenge`: Exposes CRUD operations for the **PasswordResetChallenge** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PasswordResetChallenges
    * const passwordResetChallenges = await prisma.passwordResetChallenge.findMany()
    * ```
    */
  get passwordResetChallenge(): Prisma.PasswordResetChallengeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.refreshSession`: Exposes CRUD operations for the **RefreshSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RefreshSessions
    * const refreshSessions = await prisma.refreshSession.findMany()
    * ```
    */
  get refreshSession(): Prisma.RefreshSessionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.9.1
   * Query Engine version: e922089b7d7502aff4249d5da3420f6fa55fc6ad
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * Resolved type of the argument passed to the `PrismaClient` constructor.
   *
   * When called without a narrower options type (the common case), this resolves
   * to `PrismaClientOptions` directly, which produces a clear TypeScript error
   * message (`not assignable to parameter of type 'PrismaClientOptions'`) when
   * the argument is missing or incomplete. When the user supplies a narrower
   * options type (e.g. via a literal), it falls back to `Subset` to keep
   * filtering out unknown properties.
   */
  export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> =
    [PrismaClientOptions] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      ((Without<T, U> & U) | (Without<U, T> & T)) & object
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    PendingRegistration: 'PendingRegistration',
    PasswordResetChallenge: 'PasswordResetChallenge',
    RefreshSession: 'RefreshSession'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "pendingRegistration" | "passwordResetChallenge" | "refreshSession"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      PendingRegistration: {
        payload: Prisma.$PendingRegistrationPayload<ExtArgs>
        fields: Prisma.PendingRegistrationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PendingRegistrationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingRegistrationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PendingRegistrationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingRegistrationPayload>
          }
          findFirst: {
            args: Prisma.PendingRegistrationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingRegistrationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PendingRegistrationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingRegistrationPayload>
          }
          findMany: {
            args: Prisma.PendingRegistrationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingRegistrationPayload>[]
          }
          create: {
            args: Prisma.PendingRegistrationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingRegistrationPayload>
          }
          createMany: {
            args: Prisma.PendingRegistrationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PendingRegistrationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingRegistrationPayload>[]
          }
          delete: {
            args: Prisma.PendingRegistrationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingRegistrationPayload>
          }
          update: {
            args: Prisma.PendingRegistrationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingRegistrationPayload>
          }
          deleteMany: {
            args: Prisma.PendingRegistrationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PendingRegistrationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PendingRegistrationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingRegistrationPayload>[]
          }
          upsert: {
            args: Prisma.PendingRegistrationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingRegistrationPayload>
          }
          aggregate: {
            args: Prisma.PendingRegistrationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePendingRegistration>
          }
          groupBy: {
            args: Prisma.PendingRegistrationGroupByArgs<ExtArgs>
            result: $Utils.Optional<PendingRegistrationGroupByOutputType>[]
          }
          count: {
            args: Prisma.PendingRegistrationCountArgs<ExtArgs>
            result: $Utils.Optional<PendingRegistrationCountAggregateOutputType> | number
          }
        }
      }
      PasswordResetChallenge: {
        payload: Prisma.$PasswordResetChallengePayload<ExtArgs>
        fields: Prisma.PasswordResetChallengeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PasswordResetChallengeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetChallengePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PasswordResetChallengeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetChallengePayload>
          }
          findFirst: {
            args: Prisma.PasswordResetChallengeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetChallengePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PasswordResetChallengeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetChallengePayload>
          }
          findMany: {
            args: Prisma.PasswordResetChallengeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetChallengePayload>[]
          }
          create: {
            args: Prisma.PasswordResetChallengeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetChallengePayload>
          }
          createMany: {
            args: Prisma.PasswordResetChallengeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PasswordResetChallengeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetChallengePayload>[]
          }
          delete: {
            args: Prisma.PasswordResetChallengeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetChallengePayload>
          }
          update: {
            args: Prisma.PasswordResetChallengeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetChallengePayload>
          }
          deleteMany: {
            args: Prisma.PasswordResetChallengeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PasswordResetChallengeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PasswordResetChallengeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetChallengePayload>[]
          }
          upsert: {
            args: Prisma.PasswordResetChallengeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetChallengePayload>
          }
          aggregate: {
            args: Prisma.PasswordResetChallengeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePasswordResetChallenge>
          }
          groupBy: {
            args: Prisma.PasswordResetChallengeGroupByArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetChallengeGroupByOutputType>[]
          }
          count: {
            args: Prisma.PasswordResetChallengeCountArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetChallengeCountAggregateOutputType> | number
          }
        }
      }
      RefreshSession: {
        payload: Prisma.$RefreshSessionPayload<ExtArgs>
        fields: Prisma.RefreshSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RefreshSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RefreshSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshSessionPayload>
          }
          findFirst: {
            args: Prisma.RefreshSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RefreshSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshSessionPayload>
          }
          findMany: {
            args: Prisma.RefreshSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshSessionPayload>[]
          }
          create: {
            args: Prisma.RefreshSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshSessionPayload>
          }
          createMany: {
            args: Prisma.RefreshSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RefreshSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshSessionPayload>[]
          }
          delete: {
            args: Prisma.RefreshSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshSessionPayload>
          }
          update: {
            args: Prisma.RefreshSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshSessionPayload>
          }
          deleteMany: {
            args: Prisma.RefreshSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RefreshSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RefreshSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshSessionPayload>[]
          }
          upsert: {
            args: Prisma.RefreshSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshSessionPayload>
          }
          aggregate: {
            args: Prisma.RefreshSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRefreshSession>
          }
          groupBy: {
            args: Prisma.RefreshSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<RefreshSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.RefreshSessionCountArgs<ExtArgs>
            result: $Utils.Optional<RefreshSessionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * A driver adapter that PrismaClient uses to connect to your database, such as the ones provided by `@prisma/adapter-pg`, `@prisma/adapter-libsql`, `@prisma/adapter-planetscale`, etc.
     * 
     * A driver adapter is **required** unless you connect to your database through Prisma Accelerate (in which case use `accelerateUrl` instead).
     * 
     * Learn more: https://pris.ly/d/driver-adapters
     * 
     * @example
     * ```ts
     * import { PrismaPg } from '@prisma/adapter-pg'
     * import { PrismaClient } from './generated/prisma/client'
     * 
     * const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
     * const prisma = new PrismaClient({ adapter })
     * ```
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * The Prisma Accelerate connection URL. Use this option to connect to your database through Prisma Accelerate instead of using a driver adapter to connect directly.
     * 
     * Learn more: https://pris.ly/d/accelerate
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    pendingRegistration?: PendingRegistrationOmit
    passwordResetChallenge?: PasswordResetChallengeOmit
    refreshSession?: RefreshSessionOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    passwordResets: number
    refreshSessions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    passwordResets?: boolean | UserCountOutputTypeCountPasswordResetsArgs
    refreshSessions?: boolean | UserCountOutputTypeCountRefreshSessionsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPasswordResetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasswordResetChallengeWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRefreshSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RefreshSessionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    firstName: string | null
    lastName: string | null
    username: string | null
    displayName: string | null
    phone: string | null
    country: string | null
    countryCode: string | null
    gender: string | null
    dateOfBirth: Date | null
    bio: string | null
    address: string | null
    profileImageUrl: string | null
    isEmailVerified: boolean | null
    isProfileComplete: boolean | null
    isVerified: boolean | null
    isActive: boolean | null
    role: $Enums.UserRole | null
    transactionPinHash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    firstName: string | null
    lastName: string | null
    username: string | null
    displayName: string | null
    phone: string | null
    country: string | null
    countryCode: string | null
    gender: string | null
    dateOfBirth: Date | null
    bio: string | null
    address: string | null
    profileImageUrl: string | null
    isEmailVerified: boolean | null
    isProfileComplete: boolean | null
    isVerified: boolean | null
    isActive: boolean | null
    role: $Enums.UserRole | null
    transactionPinHash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    passwordHash: number
    firstName: number
    lastName: number
    username: number
    displayName: number
    phone: number
    country: number
    countryCode: number
    gender: number
    dateOfBirth: number
    bio: number
    address: number
    profileImageUrl: number
    isEmailVerified: number
    isProfileComplete: number
    isVerified: number
    isActive: number
    role: number
    transactionPinHash: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    firstName?: true
    lastName?: true
    username?: true
    displayName?: true
    phone?: true
    country?: true
    countryCode?: true
    gender?: true
    dateOfBirth?: true
    bio?: true
    address?: true
    profileImageUrl?: true
    isEmailVerified?: true
    isProfileComplete?: true
    isVerified?: true
    isActive?: true
    role?: true
    transactionPinHash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    firstName?: true
    lastName?: true
    username?: true
    displayName?: true
    phone?: true
    country?: true
    countryCode?: true
    gender?: true
    dateOfBirth?: true
    bio?: true
    address?: true
    profileImageUrl?: true
    isEmailVerified?: true
    isProfileComplete?: true
    isVerified?: true
    isActive?: true
    role?: true
    transactionPinHash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    firstName?: true
    lastName?: true
    username?: true
    displayName?: true
    phone?: true
    country?: true
    countryCode?: true
    gender?: true
    dateOfBirth?: true
    bio?: true
    address?: true
    profileImageUrl?: true
    isEmailVerified?: true
    isProfileComplete?: true
    isVerified?: true
    isActive?: true
    role?: true
    transactionPinHash?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    username: string | null
    displayName: string | null
    phone: string | null
    country: string | null
    countryCode: string | null
    gender: string | null
    dateOfBirth: Date | null
    bio: string | null
    address: string | null
    profileImageUrl: string | null
    isEmailVerified: boolean
    isProfileComplete: boolean
    isVerified: boolean
    isActive: boolean
    role: $Enums.UserRole
    transactionPinHash: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    firstName?: boolean
    lastName?: boolean
    username?: boolean
    displayName?: boolean
    phone?: boolean
    country?: boolean
    countryCode?: boolean
    gender?: boolean
    dateOfBirth?: boolean
    bio?: boolean
    address?: boolean
    profileImageUrl?: boolean
    isEmailVerified?: boolean
    isProfileComplete?: boolean
    isVerified?: boolean
    isActive?: boolean
    role?: boolean
    transactionPinHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    passwordResets?: boolean | User$passwordResetsArgs<ExtArgs>
    pendingVerification?: boolean | User$pendingVerificationArgs<ExtArgs>
    refreshSessions?: boolean | User$refreshSessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    firstName?: boolean
    lastName?: boolean
    username?: boolean
    displayName?: boolean
    phone?: boolean
    country?: boolean
    countryCode?: boolean
    gender?: boolean
    dateOfBirth?: boolean
    bio?: boolean
    address?: boolean
    profileImageUrl?: boolean
    isEmailVerified?: boolean
    isProfileComplete?: boolean
    isVerified?: boolean
    isActive?: boolean
    role?: boolean
    transactionPinHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    firstName?: boolean
    lastName?: boolean
    username?: boolean
    displayName?: boolean
    phone?: boolean
    country?: boolean
    countryCode?: boolean
    gender?: boolean
    dateOfBirth?: boolean
    bio?: boolean
    address?: boolean
    profileImageUrl?: boolean
    isEmailVerified?: boolean
    isProfileComplete?: boolean
    isVerified?: boolean
    isActive?: boolean
    role?: boolean
    transactionPinHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    firstName?: boolean
    lastName?: boolean
    username?: boolean
    displayName?: boolean
    phone?: boolean
    country?: boolean
    countryCode?: boolean
    gender?: boolean
    dateOfBirth?: boolean
    bio?: boolean
    address?: boolean
    profileImageUrl?: boolean
    isEmailVerified?: boolean
    isProfileComplete?: boolean
    isVerified?: boolean
    isActive?: boolean
    role?: boolean
    transactionPinHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "passwordHash" | "firstName" | "lastName" | "username" | "displayName" | "phone" | "country" | "countryCode" | "gender" | "dateOfBirth" | "bio" | "address" | "profileImageUrl" | "isEmailVerified" | "isProfileComplete" | "isVerified" | "isActive" | "role" | "transactionPinHash" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    passwordResets?: boolean | User$passwordResetsArgs<ExtArgs>
    pendingVerification?: boolean | User$pendingVerificationArgs<ExtArgs>
    refreshSessions?: boolean | User$refreshSessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      passwordResets: Prisma.$PasswordResetChallengePayload<ExtArgs>[]
      pendingVerification: Prisma.$PendingRegistrationPayload<ExtArgs> | null
      refreshSessions: Prisma.$RefreshSessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      passwordHash: string
      firstName: string
      lastName: string
      username: string | null
      displayName: string | null
      phone: string | null
      country: string | null
      countryCode: string | null
      gender: string | null
      dateOfBirth: Date | null
      bio: string | null
      address: string | null
      profileImageUrl: string | null
      isEmailVerified: boolean
      isProfileComplete: boolean
      isVerified: boolean
      isActive: boolean
      role: $Enums.UserRole
      transactionPinHash: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    passwordResets<T extends User$passwordResetsArgs<ExtArgs> = {}>(args?: Subset<T, User$passwordResetsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetChallengePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    pendingVerification<T extends User$pendingVerificationArgs<ExtArgs> = {}>(args?: Subset<T, User$pendingVerificationArgs<ExtArgs>>): Prisma__PendingRegistrationClient<$Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    refreshSessions<T extends User$refreshSessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$refreshSessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly firstName: FieldRef<"User", 'String'>
    readonly lastName: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly displayName: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly country: FieldRef<"User", 'String'>
    readonly countryCode: FieldRef<"User", 'String'>
    readonly gender: FieldRef<"User", 'String'>
    readonly dateOfBirth: FieldRef<"User", 'DateTime'>
    readonly bio: FieldRef<"User", 'String'>
    readonly address: FieldRef<"User", 'String'>
    readonly profileImageUrl: FieldRef<"User", 'String'>
    readonly isEmailVerified: FieldRef<"User", 'Boolean'>
    readonly isProfileComplete: FieldRef<"User", 'Boolean'>
    readonly isVerified: FieldRef<"User", 'Boolean'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly transactionPinHash: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.passwordResets
   */
  export type User$passwordResetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetChallenge
     */
    select?: PasswordResetChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetChallenge
     */
    omit?: PasswordResetChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetChallengeInclude<ExtArgs> | null
    where?: PasswordResetChallengeWhereInput
    orderBy?: PasswordResetChallengeOrderByWithRelationInput | PasswordResetChallengeOrderByWithRelationInput[]
    cursor?: PasswordResetChallengeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PasswordResetChallengeScalarFieldEnum | PasswordResetChallengeScalarFieldEnum[]
  }

  /**
   * User.pendingVerification
   */
  export type User$pendingVerificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingRegistration
     */
    select?: PendingRegistrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingRegistration
     */
    omit?: PendingRegistrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingRegistrationInclude<ExtArgs> | null
    where?: PendingRegistrationWhereInput
  }

  /**
   * User.refreshSessions
   */
  export type User$refreshSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshSession
     */
    select?: RefreshSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshSession
     */
    omit?: RefreshSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshSessionInclude<ExtArgs> | null
    where?: RefreshSessionWhereInput
    orderBy?: RefreshSessionOrderByWithRelationInput | RefreshSessionOrderByWithRelationInput[]
    cursor?: RefreshSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RefreshSessionScalarFieldEnum | RefreshSessionScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model PendingRegistration
   */

  export type AggregatePendingRegistration = {
    _count: PendingRegistrationCountAggregateOutputType | null
    _avg: PendingRegistrationAvgAggregateOutputType | null
    _sum: PendingRegistrationSumAggregateOutputType | null
    _min: PendingRegistrationMinAggregateOutputType | null
    _max: PendingRegistrationMaxAggregateOutputType | null
  }

  export type PendingRegistrationAvgAggregateOutputType = {
    otpAttempts: number | null
  }

  export type PendingRegistrationSumAggregateOutputType = {
    otpAttempts: number | null
  }

  export type PendingRegistrationMinAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    firstName: string | null
    lastName: string | null
    phone: string | null
    country: string | null
    countryCode: string | null
    gender: string | null
    otpHash: string | null
    otpExpiresAt: Date | null
    otpAttempts: number | null
    lastOtpSentAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    existingUserId: string | null
  }

  export type PendingRegistrationMaxAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    firstName: string | null
    lastName: string | null
    phone: string | null
    country: string | null
    countryCode: string | null
    gender: string | null
    otpHash: string | null
    otpExpiresAt: Date | null
    otpAttempts: number | null
    lastOtpSentAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    existingUserId: string | null
  }

  export type PendingRegistrationCountAggregateOutputType = {
    id: number
    email: number
    passwordHash: number
    firstName: number
    lastName: number
    phone: number
    country: number
    countryCode: number
    gender: number
    otpHash: number
    otpExpiresAt: number
    otpAttempts: number
    lastOtpSentAt: number
    createdAt: number
    updatedAt: number
    existingUserId: number
    _all: number
  }


  export type PendingRegistrationAvgAggregateInputType = {
    otpAttempts?: true
  }

  export type PendingRegistrationSumAggregateInputType = {
    otpAttempts?: true
  }

  export type PendingRegistrationMinAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    firstName?: true
    lastName?: true
    phone?: true
    country?: true
    countryCode?: true
    gender?: true
    otpHash?: true
    otpExpiresAt?: true
    otpAttempts?: true
    lastOtpSentAt?: true
    createdAt?: true
    updatedAt?: true
    existingUserId?: true
  }

  export type PendingRegistrationMaxAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    firstName?: true
    lastName?: true
    phone?: true
    country?: true
    countryCode?: true
    gender?: true
    otpHash?: true
    otpExpiresAt?: true
    otpAttempts?: true
    lastOtpSentAt?: true
    createdAt?: true
    updatedAt?: true
    existingUserId?: true
  }

  export type PendingRegistrationCountAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    firstName?: true
    lastName?: true
    phone?: true
    country?: true
    countryCode?: true
    gender?: true
    otpHash?: true
    otpExpiresAt?: true
    otpAttempts?: true
    lastOtpSentAt?: true
    createdAt?: true
    updatedAt?: true
    existingUserId?: true
    _all?: true
  }

  export type PendingRegistrationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PendingRegistration to aggregate.
     */
    where?: PendingRegistrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingRegistrations to fetch.
     */
    orderBy?: PendingRegistrationOrderByWithRelationInput | PendingRegistrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PendingRegistrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingRegistrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingRegistrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PendingRegistrations
    **/
    _count?: true | PendingRegistrationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PendingRegistrationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PendingRegistrationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PendingRegistrationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PendingRegistrationMaxAggregateInputType
  }

  export type GetPendingRegistrationAggregateType<T extends PendingRegistrationAggregateArgs> = {
        [P in keyof T & keyof AggregatePendingRegistration]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePendingRegistration[P]>
      : GetScalarType<T[P], AggregatePendingRegistration[P]>
  }




  export type PendingRegistrationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PendingRegistrationWhereInput
    orderBy?: PendingRegistrationOrderByWithAggregationInput | PendingRegistrationOrderByWithAggregationInput[]
    by: PendingRegistrationScalarFieldEnum[] | PendingRegistrationScalarFieldEnum
    having?: PendingRegistrationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PendingRegistrationCountAggregateInputType | true
    _avg?: PendingRegistrationAvgAggregateInputType
    _sum?: PendingRegistrationSumAggregateInputType
    _min?: PendingRegistrationMinAggregateInputType
    _max?: PendingRegistrationMaxAggregateInputType
  }

  export type PendingRegistrationGroupByOutputType = {
    id: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    phone: string | null
    country: string | null
    countryCode: string | null
    gender: string | null
    otpHash: string
    otpExpiresAt: Date
    otpAttempts: number
    lastOtpSentAt: Date | null
    createdAt: Date
    updatedAt: Date
    existingUserId: string | null
    _count: PendingRegistrationCountAggregateOutputType | null
    _avg: PendingRegistrationAvgAggregateOutputType | null
    _sum: PendingRegistrationSumAggregateOutputType | null
    _min: PendingRegistrationMinAggregateOutputType | null
    _max: PendingRegistrationMaxAggregateOutputType | null
  }

  type GetPendingRegistrationGroupByPayload<T extends PendingRegistrationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PendingRegistrationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PendingRegistrationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PendingRegistrationGroupByOutputType[P]>
            : GetScalarType<T[P], PendingRegistrationGroupByOutputType[P]>
        }
      >
    >


  export type PendingRegistrationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    country?: boolean
    countryCode?: boolean
    gender?: boolean
    otpHash?: boolean
    otpExpiresAt?: boolean
    otpAttempts?: boolean
    lastOtpSentAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    existingUserId?: boolean
    existingUser?: boolean | PendingRegistration$existingUserArgs<ExtArgs>
  }, ExtArgs["result"]["pendingRegistration"]>

  export type PendingRegistrationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    country?: boolean
    countryCode?: boolean
    gender?: boolean
    otpHash?: boolean
    otpExpiresAt?: boolean
    otpAttempts?: boolean
    lastOtpSentAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    existingUserId?: boolean
    existingUser?: boolean | PendingRegistration$existingUserArgs<ExtArgs>
  }, ExtArgs["result"]["pendingRegistration"]>

  export type PendingRegistrationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    country?: boolean
    countryCode?: boolean
    gender?: boolean
    otpHash?: boolean
    otpExpiresAt?: boolean
    otpAttempts?: boolean
    lastOtpSentAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    existingUserId?: boolean
    existingUser?: boolean | PendingRegistration$existingUserArgs<ExtArgs>
  }, ExtArgs["result"]["pendingRegistration"]>

  export type PendingRegistrationSelectScalar = {
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    country?: boolean
    countryCode?: boolean
    gender?: boolean
    otpHash?: boolean
    otpExpiresAt?: boolean
    otpAttempts?: boolean
    lastOtpSentAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    existingUserId?: boolean
  }

  export type PendingRegistrationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "passwordHash" | "firstName" | "lastName" | "phone" | "country" | "countryCode" | "gender" | "otpHash" | "otpExpiresAt" | "otpAttempts" | "lastOtpSentAt" | "createdAt" | "updatedAt" | "existingUserId", ExtArgs["result"]["pendingRegistration"]>
  export type PendingRegistrationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    existingUser?: boolean | PendingRegistration$existingUserArgs<ExtArgs>
  }
  export type PendingRegistrationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    existingUser?: boolean | PendingRegistration$existingUserArgs<ExtArgs>
  }
  export type PendingRegistrationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    existingUser?: boolean | PendingRegistration$existingUserArgs<ExtArgs>
  }

  export type $PendingRegistrationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PendingRegistration"
    objects: {
      existingUser: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      passwordHash: string
      firstName: string
      lastName: string
      phone: string | null
      country: string | null
      countryCode: string | null
      gender: string | null
      otpHash: string
      otpExpiresAt: Date
      otpAttempts: number
      lastOtpSentAt: Date | null
      createdAt: Date
      updatedAt: Date
      existingUserId: string | null
    }, ExtArgs["result"]["pendingRegistration"]>
    composites: {}
  }

  type PendingRegistrationGetPayload<S extends boolean | null | undefined | PendingRegistrationDefaultArgs> = $Result.GetResult<Prisma.$PendingRegistrationPayload, S>

  type PendingRegistrationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PendingRegistrationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PendingRegistrationCountAggregateInputType | true
    }

  export interface PendingRegistrationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PendingRegistration'], meta: { name: 'PendingRegistration' } }
    /**
     * Find zero or one PendingRegistration that matches the filter.
     * @param {PendingRegistrationFindUniqueArgs} args - Arguments to find a PendingRegistration
     * @example
     * // Get one PendingRegistration
     * const pendingRegistration = await prisma.pendingRegistration.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PendingRegistrationFindUniqueArgs>(args: SelectSubset<T, PendingRegistrationFindUniqueArgs<ExtArgs>>): Prisma__PendingRegistrationClient<$Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PendingRegistration that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PendingRegistrationFindUniqueOrThrowArgs} args - Arguments to find a PendingRegistration
     * @example
     * // Get one PendingRegistration
     * const pendingRegistration = await prisma.pendingRegistration.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PendingRegistrationFindUniqueOrThrowArgs>(args: SelectSubset<T, PendingRegistrationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PendingRegistrationClient<$Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PendingRegistration that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingRegistrationFindFirstArgs} args - Arguments to find a PendingRegistration
     * @example
     * // Get one PendingRegistration
     * const pendingRegistration = await prisma.pendingRegistration.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PendingRegistrationFindFirstArgs>(args?: SelectSubset<T, PendingRegistrationFindFirstArgs<ExtArgs>>): Prisma__PendingRegistrationClient<$Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PendingRegistration that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingRegistrationFindFirstOrThrowArgs} args - Arguments to find a PendingRegistration
     * @example
     * // Get one PendingRegistration
     * const pendingRegistration = await prisma.pendingRegistration.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PendingRegistrationFindFirstOrThrowArgs>(args?: SelectSubset<T, PendingRegistrationFindFirstOrThrowArgs<ExtArgs>>): Prisma__PendingRegistrationClient<$Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PendingRegistrations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingRegistrationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PendingRegistrations
     * const pendingRegistrations = await prisma.pendingRegistration.findMany()
     * 
     * // Get first 10 PendingRegistrations
     * const pendingRegistrations = await prisma.pendingRegistration.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pendingRegistrationWithIdOnly = await prisma.pendingRegistration.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PendingRegistrationFindManyArgs>(args?: SelectSubset<T, PendingRegistrationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PendingRegistration.
     * @param {PendingRegistrationCreateArgs} args - Arguments to create a PendingRegistration.
     * @example
     * // Create one PendingRegistration
     * const PendingRegistration = await prisma.pendingRegistration.create({
     *   data: {
     *     // ... data to create a PendingRegistration
     *   }
     * })
     * 
     */
    create<T extends PendingRegistrationCreateArgs>(args: SelectSubset<T, PendingRegistrationCreateArgs<ExtArgs>>): Prisma__PendingRegistrationClient<$Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PendingRegistrations.
     * @param {PendingRegistrationCreateManyArgs} args - Arguments to create many PendingRegistrations.
     * @example
     * // Create many PendingRegistrations
     * const pendingRegistration = await prisma.pendingRegistration.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PendingRegistrationCreateManyArgs>(args?: SelectSubset<T, PendingRegistrationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PendingRegistrations and returns the data saved in the database.
     * @param {PendingRegistrationCreateManyAndReturnArgs} args - Arguments to create many PendingRegistrations.
     * @example
     * // Create many PendingRegistrations
     * const pendingRegistration = await prisma.pendingRegistration.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PendingRegistrations and only return the `id`
     * const pendingRegistrationWithIdOnly = await prisma.pendingRegistration.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PendingRegistrationCreateManyAndReturnArgs>(args?: SelectSubset<T, PendingRegistrationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PendingRegistration.
     * @param {PendingRegistrationDeleteArgs} args - Arguments to delete one PendingRegistration.
     * @example
     * // Delete one PendingRegistration
     * const PendingRegistration = await prisma.pendingRegistration.delete({
     *   where: {
     *     // ... filter to delete one PendingRegistration
     *   }
     * })
     * 
     */
    delete<T extends PendingRegistrationDeleteArgs>(args: SelectSubset<T, PendingRegistrationDeleteArgs<ExtArgs>>): Prisma__PendingRegistrationClient<$Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PendingRegistration.
     * @param {PendingRegistrationUpdateArgs} args - Arguments to update one PendingRegistration.
     * @example
     * // Update one PendingRegistration
     * const pendingRegistration = await prisma.pendingRegistration.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PendingRegistrationUpdateArgs>(args: SelectSubset<T, PendingRegistrationUpdateArgs<ExtArgs>>): Prisma__PendingRegistrationClient<$Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PendingRegistrations.
     * @param {PendingRegistrationDeleteManyArgs} args - Arguments to filter PendingRegistrations to delete.
     * @example
     * // Delete a few PendingRegistrations
     * const { count } = await prisma.pendingRegistration.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PendingRegistrationDeleteManyArgs>(args?: SelectSubset<T, PendingRegistrationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PendingRegistrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingRegistrationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PendingRegistrations
     * const pendingRegistration = await prisma.pendingRegistration.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PendingRegistrationUpdateManyArgs>(args: SelectSubset<T, PendingRegistrationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PendingRegistrations and returns the data updated in the database.
     * @param {PendingRegistrationUpdateManyAndReturnArgs} args - Arguments to update many PendingRegistrations.
     * @example
     * // Update many PendingRegistrations
     * const pendingRegistration = await prisma.pendingRegistration.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PendingRegistrations and only return the `id`
     * const pendingRegistrationWithIdOnly = await prisma.pendingRegistration.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PendingRegistrationUpdateManyAndReturnArgs>(args: SelectSubset<T, PendingRegistrationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PendingRegistration.
     * @param {PendingRegistrationUpsertArgs} args - Arguments to update or create a PendingRegistration.
     * @example
     * // Update or create a PendingRegistration
     * const pendingRegistration = await prisma.pendingRegistration.upsert({
     *   create: {
     *     // ... data to create a PendingRegistration
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PendingRegistration we want to update
     *   }
     * })
     */
    upsert<T extends PendingRegistrationUpsertArgs>(args: SelectSubset<T, PendingRegistrationUpsertArgs<ExtArgs>>): Prisma__PendingRegistrationClient<$Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PendingRegistrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingRegistrationCountArgs} args - Arguments to filter PendingRegistrations to count.
     * @example
     * // Count the number of PendingRegistrations
     * const count = await prisma.pendingRegistration.count({
     *   where: {
     *     // ... the filter for the PendingRegistrations we want to count
     *   }
     * })
    **/
    count<T extends PendingRegistrationCountArgs>(
      args?: Subset<T, PendingRegistrationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PendingRegistrationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PendingRegistration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingRegistrationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PendingRegistrationAggregateArgs>(args: Subset<T, PendingRegistrationAggregateArgs>): Prisma.PrismaPromise<GetPendingRegistrationAggregateType<T>>

    /**
     * Group by PendingRegistration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingRegistrationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PendingRegistrationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PendingRegistrationGroupByArgs['orderBy'] }
        : { orderBy?: PendingRegistrationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PendingRegistrationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPendingRegistrationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PendingRegistration model
   */
  readonly fields: PendingRegistrationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PendingRegistration.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PendingRegistrationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    existingUser<T extends PendingRegistration$existingUserArgs<ExtArgs> = {}>(args?: Subset<T, PendingRegistration$existingUserArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PendingRegistration model
   */
  interface PendingRegistrationFieldRefs {
    readonly id: FieldRef<"PendingRegistration", 'String'>
    readonly email: FieldRef<"PendingRegistration", 'String'>
    readonly passwordHash: FieldRef<"PendingRegistration", 'String'>
    readonly firstName: FieldRef<"PendingRegistration", 'String'>
    readonly lastName: FieldRef<"PendingRegistration", 'String'>
    readonly phone: FieldRef<"PendingRegistration", 'String'>
    readonly country: FieldRef<"PendingRegistration", 'String'>
    readonly countryCode: FieldRef<"PendingRegistration", 'String'>
    readonly gender: FieldRef<"PendingRegistration", 'String'>
    readonly otpHash: FieldRef<"PendingRegistration", 'String'>
    readonly otpExpiresAt: FieldRef<"PendingRegistration", 'DateTime'>
    readonly otpAttempts: FieldRef<"PendingRegistration", 'Int'>
    readonly lastOtpSentAt: FieldRef<"PendingRegistration", 'DateTime'>
    readonly createdAt: FieldRef<"PendingRegistration", 'DateTime'>
    readonly updatedAt: FieldRef<"PendingRegistration", 'DateTime'>
    readonly existingUserId: FieldRef<"PendingRegistration", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PendingRegistration findUnique
   */
  export type PendingRegistrationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingRegistration
     */
    select?: PendingRegistrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingRegistration
     */
    omit?: PendingRegistrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingRegistrationInclude<ExtArgs> | null
    /**
     * Filter, which PendingRegistration to fetch.
     */
    where: PendingRegistrationWhereUniqueInput
  }

  /**
   * PendingRegistration findUniqueOrThrow
   */
  export type PendingRegistrationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingRegistration
     */
    select?: PendingRegistrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingRegistration
     */
    omit?: PendingRegistrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingRegistrationInclude<ExtArgs> | null
    /**
     * Filter, which PendingRegistration to fetch.
     */
    where: PendingRegistrationWhereUniqueInput
  }

  /**
   * PendingRegistration findFirst
   */
  export type PendingRegistrationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingRegistration
     */
    select?: PendingRegistrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingRegistration
     */
    omit?: PendingRegistrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingRegistrationInclude<ExtArgs> | null
    /**
     * Filter, which PendingRegistration to fetch.
     */
    where?: PendingRegistrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingRegistrations to fetch.
     */
    orderBy?: PendingRegistrationOrderByWithRelationInput | PendingRegistrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PendingRegistrations.
     */
    cursor?: PendingRegistrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingRegistrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingRegistrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PendingRegistrations.
     */
    distinct?: PendingRegistrationScalarFieldEnum | PendingRegistrationScalarFieldEnum[]
  }

  /**
   * PendingRegistration findFirstOrThrow
   */
  export type PendingRegistrationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingRegistration
     */
    select?: PendingRegistrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingRegistration
     */
    omit?: PendingRegistrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingRegistrationInclude<ExtArgs> | null
    /**
     * Filter, which PendingRegistration to fetch.
     */
    where?: PendingRegistrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingRegistrations to fetch.
     */
    orderBy?: PendingRegistrationOrderByWithRelationInput | PendingRegistrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PendingRegistrations.
     */
    cursor?: PendingRegistrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingRegistrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingRegistrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PendingRegistrations.
     */
    distinct?: PendingRegistrationScalarFieldEnum | PendingRegistrationScalarFieldEnum[]
  }

  /**
   * PendingRegistration findMany
   */
  export type PendingRegistrationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingRegistration
     */
    select?: PendingRegistrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingRegistration
     */
    omit?: PendingRegistrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingRegistrationInclude<ExtArgs> | null
    /**
     * Filter, which PendingRegistrations to fetch.
     */
    where?: PendingRegistrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingRegistrations to fetch.
     */
    orderBy?: PendingRegistrationOrderByWithRelationInput | PendingRegistrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PendingRegistrations.
     */
    cursor?: PendingRegistrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingRegistrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingRegistrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PendingRegistrations.
     */
    distinct?: PendingRegistrationScalarFieldEnum | PendingRegistrationScalarFieldEnum[]
  }

  /**
   * PendingRegistration create
   */
  export type PendingRegistrationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingRegistration
     */
    select?: PendingRegistrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingRegistration
     */
    omit?: PendingRegistrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingRegistrationInclude<ExtArgs> | null
    /**
     * The data needed to create a PendingRegistration.
     */
    data: XOR<PendingRegistrationCreateInput, PendingRegistrationUncheckedCreateInput>
  }

  /**
   * PendingRegistration createMany
   */
  export type PendingRegistrationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PendingRegistrations.
     */
    data: PendingRegistrationCreateManyInput | PendingRegistrationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PendingRegistration createManyAndReturn
   */
  export type PendingRegistrationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingRegistration
     */
    select?: PendingRegistrationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PendingRegistration
     */
    omit?: PendingRegistrationOmit<ExtArgs> | null
    /**
     * The data used to create many PendingRegistrations.
     */
    data: PendingRegistrationCreateManyInput | PendingRegistrationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingRegistrationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PendingRegistration update
   */
  export type PendingRegistrationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingRegistration
     */
    select?: PendingRegistrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingRegistration
     */
    omit?: PendingRegistrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingRegistrationInclude<ExtArgs> | null
    /**
     * The data needed to update a PendingRegistration.
     */
    data: XOR<PendingRegistrationUpdateInput, PendingRegistrationUncheckedUpdateInput>
    /**
     * Choose, which PendingRegistration to update.
     */
    where: PendingRegistrationWhereUniqueInput
  }

  /**
   * PendingRegistration updateMany
   */
  export type PendingRegistrationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PendingRegistrations.
     */
    data: XOR<PendingRegistrationUpdateManyMutationInput, PendingRegistrationUncheckedUpdateManyInput>
    /**
     * Filter which PendingRegistrations to update
     */
    where?: PendingRegistrationWhereInput
    /**
     * Limit how many PendingRegistrations to update.
     */
    limit?: number
  }

  /**
   * PendingRegistration updateManyAndReturn
   */
  export type PendingRegistrationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingRegistration
     */
    select?: PendingRegistrationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PendingRegistration
     */
    omit?: PendingRegistrationOmit<ExtArgs> | null
    /**
     * The data used to update PendingRegistrations.
     */
    data: XOR<PendingRegistrationUpdateManyMutationInput, PendingRegistrationUncheckedUpdateManyInput>
    /**
     * Filter which PendingRegistrations to update
     */
    where?: PendingRegistrationWhereInput
    /**
     * Limit how many PendingRegistrations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingRegistrationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PendingRegistration upsert
   */
  export type PendingRegistrationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingRegistration
     */
    select?: PendingRegistrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingRegistration
     */
    omit?: PendingRegistrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingRegistrationInclude<ExtArgs> | null
    /**
     * The filter to search for the PendingRegistration to update in case it exists.
     */
    where: PendingRegistrationWhereUniqueInput
    /**
     * In case the PendingRegistration found by the `where` argument doesn't exist, create a new PendingRegistration with this data.
     */
    create: XOR<PendingRegistrationCreateInput, PendingRegistrationUncheckedCreateInput>
    /**
     * In case the PendingRegistration was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PendingRegistrationUpdateInput, PendingRegistrationUncheckedUpdateInput>
  }

  /**
   * PendingRegistration delete
   */
  export type PendingRegistrationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingRegistration
     */
    select?: PendingRegistrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingRegistration
     */
    omit?: PendingRegistrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingRegistrationInclude<ExtArgs> | null
    /**
     * Filter which PendingRegistration to delete.
     */
    where: PendingRegistrationWhereUniqueInput
  }

  /**
   * PendingRegistration deleteMany
   */
  export type PendingRegistrationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PendingRegistrations to delete
     */
    where?: PendingRegistrationWhereInput
    /**
     * Limit how many PendingRegistrations to delete.
     */
    limit?: number
  }

  /**
   * PendingRegistration.existingUser
   */
  export type PendingRegistration$existingUserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * PendingRegistration without action
   */
  export type PendingRegistrationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingRegistration
     */
    select?: PendingRegistrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingRegistration
     */
    omit?: PendingRegistrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingRegistrationInclude<ExtArgs> | null
  }


  /**
   * Model PasswordResetChallenge
   */

  export type AggregatePasswordResetChallenge = {
    _count: PasswordResetChallengeCountAggregateOutputType | null
    _avg: PasswordResetChallengeAvgAggregateOutputType | null
    _sum: PasswordResetChallengeSumAggregateOutputType | null
    _min: PasswordResetChallengeMinAggregateOutputType | null
    _max: PasswordResetChallengeMaxAggregateOutputType | null
  }

  export type PasswordResetChallengeAvgAggregateOutputType = {
    attempts: number | null
  }

  export type PasswordResetChallengeSumAggregateOutputType = {
    attempts: number | null
  }

  export type PasswordResetChallengeMinAggregateOutputType = {
    id: string | null
    userId: string | null
    codeHash: string | null
    expiresAt: Date | null
    attempts: number | null
    consumedAt: Date | null
    createdAt: Date | null
  }

  export type PasswordResetChallengeMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    codeHash: string | null
    expiresAt: Date | null
    attempts: number | null
    consumedAt: Date | null
    createdAt: Date | null
  }

  export type PasswordResetChallengeCountAggregateOutputType = {
    id: number
    userId: number
    codeHash: number
    expiresAt: number
    attempts: number
    consumedAt: number
    createdAt: number
    _all: number
  }


  export type PasswordResetChallengeAvgAggregateInputType = {
    attempts?: true
  }

  export type PasswordResetChallengeSumAggregateInputType = {
    attempts?: true
  }

  export type PasswordResetChallengeMinAggregateInputType = {
    id?: true
    userId?: true
    codeHash?: true
    expiresAt?: true
    attempts?: true
    consumedAt?: true
    createdAt?: true
  }

  export type PasswordResetChallengeMaxAggregateInputType = {
    id?: true
    userId?: true
    codeHash?: true
    expiresAt?: true
    attempts?: true
    consumedAt?: true
    createdAt?: true
  }

  export type PasswordResetChallengeCountAggregateInputType = {
    id?: true
    userId?: true
    codeHash?: true
    expiresAt?: true
    attempts?: true
    consumedAt?: true
    createdAt?: true
    _all?: true
  }

  export type PasswordResetChallengeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordResetChallenge to aggregate.
     */
    where?: PasswordResetChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetChallenges to fetch.
     */
    orderBy?: PasswordResetChallengeOrderByWithRelationInput | PasswordResetChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PasswordResetChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetChallenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetChallenges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PasswordResetChallenges
    **/
    _count?: true | PasswordResetChallengeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PasswordResetChallengeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PasswordResetChallengeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PasswordResetChallengeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PasswordResetChallengeMaxAggregateInputType
  }

  export type GetPasswordResetChallengeAggregateType<T extends PasswordResetChallengeAggregateArgs> = {
        [P in keyof T & keyof AggregatePasswordResetChallenge]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePasswordResetChallenge[P]>
      : GetScalarType<T[P], AggregatePasswordResetChallenge[P]>
  }




  export type PasswordResetChallengeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasswordResetChallengeWhereInput
    orderBy?: PasswordResetChallengeOrderByWithAggregationInput | PasswordResetChallengeOrderByWithAggregationInput[]
    by: PasswordResetChallengeScalarFieldEnum[] | PasswordResetChallengeScalarFieldEnum
    having?: PasswordResetChallengeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PasswordResetChallengeCountAggregateInputType | true
    _avg?: PasswordResetChallengeAvgAggregateInputType
    _sum?: PasswordResetChallengeSumAggregateInputType
    _min?: PasswordResetChallengeMinAggregateInputType
    _max?: PasswordResetChallengeMaxAggregateInputType
  }

  export type PasswordResetChallengeGroupByOutputType = {
    id: string
    userId: string
    codeHash: string
    expiresAt: Date
    attempts: number
    consumedAt: Date | null
    createdAt: Date
    _count: PasswordResetChallengeCountAggregateOutputType | null
    _avg: PasswordResetChallengeAvgAggregateOutputType | null
    _sum: PasswordResetChallengeSumAggregateOutputType | null
    _min: PasswordResetChallengeMinAggregateOutputType | null
    _max: PasswordResetChallengeMaxAggregateOutputType | null
  }

  type GetPasswordResetChallengeGroupByPayload<T extends PasswordResetChallengeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PasswordResetChallengeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PasswordResetChallengeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PasswordResetChallengeGroupByOutputType[P]>
            : GetScalarType<T[P], PasswordResetChallengeGroupByOutputType[P]>
        }
      >
    >


  export type PasswordResetChallengeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    codeHash?: boolean
    expiresAt?: boolean
    attempts?: boolean
    consumedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passwordResetChallenge"]>

  export type PasswordResetChallengeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    codeHash?: boolean
    expiresAt?: boolean
    attempts?: boolean
    consumedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passwordResetChallenge"]>

  export type PasswordResetChallengeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    codeHash?: boolean
    expiresAt?: boolean
    attempts?: boolean
    consumedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passwordResetChallenge"]>

  export type PasswordResetChallengeSelectScalar = {
    id?: boolean
    userId?: boolean
    codeHash?: boolean
    expiresAt?: boolean
    attempts?: boolean
    consumedAt?: boolean
    createdAt?: boolean
  }

  export type PasswordResetChallengeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "codeHash" | "expiresAt" | "attempts" | "consumedAt" | "createdAt", ExtArgs["result"]["passwordResetChallenge"]>
  export type PasswordResetChallengeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PasswordResetChallengeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PasswordResetChallengeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PasswordResetChallengePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PasswordResetChallenge"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      codeHash: string
      expiresAt: Date
      attempts: number
      consumedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["passwordResetChallenge"]>
    composites: {}
  }

  type PasswordResetChallengeGetPayload<S extends boolean | null | undefined | PasswordResetChallengeDefaultArgs> = $Result.GetResult<Prisma.$PasswordResetChallengePayload, S>

  type PasswordResetChallengeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PasswordResetChallengeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PasswordResetChallengeCountAggregateInputType | true
    }

  export interface PasswordResetChallengeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PasswordResetChallenge'], meta: { name: 'PasswordResetChallenge' } }
    /**
     * Find zero or one PasswordResetChallenge that matches the filter.
     * @param {PasswordResetChallengeFindUniqueArgs} args - Arguments to find a PasswordResetChallenge
     * @example
     * // Get one PasswordResetChallenge
     * const passwordResetChallenge = await prisma.passwordResetChallenge.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PasswordResetChallengeFindUniqueArgs>(args: SelectSubset<T, PasswordResetChallengeFindUniqueArgs<ExtArgs>>): Prisma__PasswordResetChallengeClient<$Result.GetResult<Prisma.$PasswordResetChallengePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PasswordResetChallenge that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PasswordResetChallengeFindUniqueOrThrowArgs} args - Arguments to find a PasswordResetChallenge
     * @example
     * // Get one PasswordResetChallenge
     * const passwordResetChallenge = await prisma.passwordResetChallenge.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PasswordResetChallengeFindUniqueOrThrowArgs>(args: SelectSubset<T, PasswordResetChallengeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PasswordResetChallengeClient<$Result.GetResult<Prisma.$PasswordResetChallengePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PasswordResetChallenge that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetChallengeFindFirstArgs} args - Arguments to find a PasswordResetChallenge
     * @example
     * // Get one PasswordResetChallenge
     * const passwordResetChallenge = await prisma.passwordResetChallenge.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PasswordResetChallengeFindFirstArgs>(args?: SelectSubset<T, PasswordResetChallengeFindFirstArgs<ExtArgs>>): Prisma__PasswordResetChallengeClient<$Result.GetResult<Prisma.$PasswordResetChallengePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PasswordResetChallenge that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetChallengeFindFirstOrThrowArgs} args - Arguments to find a PasswordResetChallenge
     * @example
     * // Get one PasswordResetChallenge
     * const passwordResetChallenge = await prisma.passwordResetChallenge.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PasswordResetChallengeFindFirstOrThrowArgs>(args?: SelectSubset<T, PasswordResetChallengeFindFirstOrThrowArgs<ExtArgs>>): Prisma__PasswordResetChallengeClient<$Result.GetResult<Prisma.$PasswordResetChallengePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PasswordResetChallenges that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetChallengeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PasswordResetChallenges
     * const passwordResetChallenges = await prisma.passwordResetChallenge.findMany()
     * 
     * // Get first 10 PasswordResetChallenges
     * const passwordResetChallenges = await prisma.passwordResetChallenge.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const passwordResetChallengeWithIdOnly = await prisma.passwordResetChallenge.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PasswordResetChallengeFindManyArgs>(args?: SelectSubset<T, PasswordResetChallengeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetChallengePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PasswordResetChallenge.
     * @param {PasswordResetChallengeCreateArgs} args - Arguments to create a PasswordResetChallenge.
     * @example
     * // Create one PasswordResetChallenge
     * const PasswordResetChallenge = await prisma.passwordResetChallenge.create({
     *   data: {
     *     // ... data to create a PasswordResetChallenge
     *   }
     * })
     * 
     */
    create<T extends PasswordResetChallengeCreateArgs>(args: SelectSubset<T, PasswordResetChallengeCreateArgs<ExtArgs>>): Prisma__PasswordResetChallengeClient<$Result.GetResult<Prisma.$PasswordResetChallengePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PasswordResetChallenges.
     * @param {PasswordResetChallengeCreateManyArgs} args - Arguments to create many PasswordResetChallenges.
     * @example
     * // Create many PasswordResetChallenges
     * const passwordResetChallenge = await prisma.passwordResetChallenge.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PasswordResetChallengeCreateManyArgs>(args?: SelectSubset<T, PasswordResetChallengeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PasswordResetChallenges and returns the data saved in the database.
     * @param {PasswordResetChallengeCreateManyAndReturnArgs} args - Arguments to create many PasswordResetChallenges.
     * @example
     * // Create many PasswordResetChallenges
     * const passwordResetChallenge = await prisma.passwordResetChallenge.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PasswordResetChallenges and only return the `id`
     * const passwordResetChallengeWithIdOnly = await prisma.passwordResetChallenge.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PasswordResetChallengeCreateManyAndReturnArgs>(args?: SelectSubset<T, PasswordResetChallengeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetChallengePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PasswordResetChallenge.
     * @param {PasswordResetChallengeDeleteArgs} args - Arguments to delete one PasswordResetChallenge.
     * @example
     * // Delete one PasswordResetChallenge
     * const PasswordResetChallenge = await prisma.passwordResetChallenge.delete({
     *   where: {
     *     // ... filter to delete one PasswordResetChallenge
     *   }
     * })
     * 
     */
    delete<T extends PasswordResetChallengeDeleteArgs>(args: SelectSubset<T, PasswordResetChallengeDeleteArgs<ExtArgs>>): Prisma__PasswordResetChallengeClient<$Result.GetResult<Prisma.$PasswordResetChallengePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PasswordResetChallenge.
     * @param {PasswordResetChallengeUpdateArgs} args - Arguments to update one PasswordResetChallenge.
     * @example
     * // Update one PasswordResetChallenge
     * const passwordResetChallenge = await prisma.passwordResetChallenge.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PasswordResetChallengeUpdateArgs>(args: SelectSubset<T, PasswordResetChallengeUpdateArgs<ExtArgs>>): Prisma__PasswordResetChallengeClient<$Result.GetResult<Prisma.$PasswordResetChallengePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PasswordResetChallenges.
     * @param {PasswordResetChallengeDeleteManyArgs} args - Arguments to filter PasswordResetChallenges to delete.
     * @example
     * // Delete a few PasswordResetChallenges
     * const { count } = await prisma.passwordResetChallenge.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PasswordResetChallengeDeleteManyArgs>(args?: SelectSubset<T, PasswordResetChallengeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasswordResetChallenges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetChallengeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PasswordResetChallenges
     * const passwordResetChallenge = await prisma.passwordResetChallenge.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PasswordResetChallengeUpdateManyArgs>(args: SelectSubset<T, PasswordResetChallengeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasswordResetChallenges and returns the data updated in the database.
     * @param {PasswordResetChallengeUpdateManyAndReturnArgs} args - Arguments to update many PasswordResetChallenges.
     * @example
     * // Update many PasswordResetChallenges
     * const passwordResetChallenge = await prisma.passwordResetChallenge.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PasswordResetChallenges and only return the `id`
     * const passwordResetChallengeWithIdOnly = await prisma.passwordResetChallenge.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PasswordResetChallengeUpdateManyAndReturnArgs>(args: SelectSubset<T, PasswordResetChallengeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetChallengePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PasswordResetChallenge.
     * @param {PasswordResetChallengeUpsertArgs} args - Arguments to update or create a PasswordResetChallenge.
     * @example
     * // Update or create a PasswordResetChallenge
     * const passwordResetChallenge = await prisma.passwordResetChallenge.upsert({
     *   create: {
     *     // ... data to create a PasswordResetChallenge
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PasswordResetChallenge we want to update
     *   }
     * })
     */
    upsert<T extends PasswordResetChallengeUpsertArgs>(args: SelectSubset<T, PasswordResetChallengeUpsertArgs<ExtArgs>>): Prisma__PasswordResetChallengeClient<$Result.GetResult<Prisma.$PasswordResetChallengePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PasswordResetChallenges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetChallengeCountArgs} args - Arguments to filter PasswordResetChallenges to count.
     * @example
     * // Count the number of PasswordResetChallenges
     * const count = await prisma.passwordResetChallenge.count({
     *   where: {
     *     // ... the filter for the PasswordResetChallenges we want to count
     *   }
     * })
    **/
    count<T extends PasswordResetChallengeCountArgs>(
      args?: Subset<T, PasswordResetChallengeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PasswordResetChallengeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PasswordResetChallenge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetChallengeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PasswordResetChallengeAggregateArgs>(args: Subset<T, PasswordResetChallengeAggregateArgs>): Prisma.PrismaPromise<GetPasswordResetChallengeAggregateType<T>>

    /**
     * Group by PasswordResetChallenge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetChallengeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PasswordResetChallengeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PasswordResetChallengeGroupByArgs['orderBy'] }
        : { orderBy?: PasswordResetChallengeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PasswordResetChallengeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPasswordResetChallengeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PasswordResetChallenge model
   */
  readonly fields: PasswordResetChallengeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PasswordResetChallenge.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PasswordResetChallengeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PasswordResetChallenge model
   */
  interface PasswordResetChallengeFieldRefs {
    readonly id: FieldRef<"PasswordResetChallenge", 'String'>
    readonly userId: FieldRef<"PasswordResetChallenge", 'String'>
    readonly codeHash: FieldRef<"PasswordResetChallenge", 'String'>
    readonly expiresAt: FieldRef<"PasswordResetChallenge", 'DateTime'>
    readonly attempts: FieldRef<"PasswordResetChallenge", 'Int'>
    readonly consumedAt: FieldRef<"PasswordResetChallenge", 'DateTime'>
    readonly createdAt: FieldRef<"PasswordResetChallenge", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PasswordResetChallenge findUnique
   */
  export type PasswordResetChallengeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetChallenge
     */
    select?: PasswordResetChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetChallenge
     */
    omit?: PasswordResetChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetChallengeInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetChallenge to fetch.
     */
    where: PasswordResetChallengeWhereUniqueInput
  }

  /**
   * PasswordResetChallenge findUniqueOrThrow
   */
  export type PasswordResetChallengeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetChallenge
     */
    select?: PasswordResetChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetChallenge
     */
    omit?: PasswordResetChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetChallengeInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetChallenge to fetch.
     */
    where: PasswordResetChallengeWhereUniqueInput
  }

  /**
   * PasswordResetChallenge findFirst
   */
  export type PasswordResetChallengeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetChallenge
     */
    select?: PasswordResetChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetChallenge
     */
    omit?: PasswordResetChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetChallengeInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetChallenge to fetch.
     */
    where?: PasswordResetChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetChallenges to fetch.
     */
    orderBy?: PasswordResetChallengeOrderByWithRelationInput | PasswordResetChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResetChallenges.
     */
    cursor?: PasswordResetChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetChallenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetChallenges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResetChallenges.
     */
    distinct?: PasswordResetChallengeScalarFieldEnum | PasswordResetChallengeScalarFieldEnum[]
  }

  /**
   * PasswordResetChallenge findFirstOrThrow
   */
  export type PasswordResetChallengeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetChallenge
     */
    select?: PasswordResetChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetChallenge
     */
    omit?: PasswordResetChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetChallengeInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetChallenge to fetch.
     */
    where?: PasswordResetChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetChallenges to fetch.
     */
    orderBy?: PasswordResetChallengeOrderByWithRelationInput | PasswordResetChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResetChallenges.
     */
    cursor?: PasswordResetChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetChallenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetChallenges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResetChallenges.
     */
    distinct?: PasswordResetChallengeScalarFieldEnum | PasswordResetChallengeScalarFieldEnum[]
  }

  /**
   * PasswordResetChallenge findMany
   */
  export type PasswordResetChallengeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetChallenge
     */
    select?: PasswordResetChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetChallenge
     */
    omit?: PasswordResetChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetChallengeInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetChallenges to fetch.
     */
    where?: PasswordResetChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetChallenges to fetch.
     */
    orderBy?: PasswordResetChallengeOrderByWithRelationInput | PasswordResetChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PasswordResetChallenges.
     */
    cursor?: PasswordResetChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetChallenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetChallenges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResetChallenges.
     */
    distinct?: PasswordResetChallengeScalarFieldEnum | PasswordResetChallengeScalarFieldEnum[]
  }

  /**
   * PasswordResetChallenge create
   */
  export type PasswordResetChallengeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetChallenge
     */
    select?: PasswordResetChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetChallenge
     */
    omit?: PasswordResetChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetChallengeInclude<ExtArgs> | null
    /**
     * The data needed to create a PasswordResetChallenge.
     */
    data: XOR<PasswordResetChallengeCreateInput, PasswordResetChallengeUncheckedCreateInput>
  }

  /**
   * PasswordResetChallenge createMany
   */
  export type PasswordResetChallengeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PasswordResetChallenges.
     */
    data: PasswordResetChallengeCreateManyInput | PasswordResetChallengeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PasswordResetChallenge createManyAndReturn
   */
  export type PasswordResetChallengeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetChallenge
     */
    select?: PasswordResetChallengeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetChallenge
     */
    omit?: PasswordResetChallengeOmit<ExtArgs> | null
    /**
     * The data used to create many PasswordResetChallenges.
     */
    data: PasswordResetChallengeCreateManyInput | PasswordResetChallengeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetChallengeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PasswordResetChallenge update
   */
  export type PasswordResetChallengeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetChallenge
     */
    select?: PasswordResetChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetChallenge
     */
    omit?: PasswordResetChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetChallengeInclude<ExtArgs> | null
    /**
     * The data needed to update a PasswordResetChallenge.
     */
    data: XOR<PasswordResetChallengeUpdateInput, PasswordResetChallengeUncheckedUpdateInput>
    /**
     * Choose, which PasswordResetChallenge to update.
     */
    where: PasswordResetChallengeWhereUniqueInput
  }

  /**
   * PasswordResetChallenge updateMany
   */
  export type PasswordResetChallengeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PasswordResetChallenges.
     */
    data: XOR<PasswordResetChallengeUpdateManyMutationInput, PasswordResetChallengeUncheckedUpdateManyInput>
    /**
     * Filter which PasswordResetChallenges to update
     */
    where?: PasswordResetChallengeWhereInput
    /**
     * Limit how many PasswordResetChallenges to update.
     */
    limit?: number
  }

  /**
   * PasswordResetChallenge updateManyAndReturn
   */
  export type PasswordResetChallengeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetChallenge
     */
    select?: PasswordResetChallengeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetChallenge
     */
    omit?: PasswordResetChallengeOmit<ExtArgs> | null
    /**
     * The data used to update PasswordResetChallenges.
     */
    data: XOR<PasswordResetChallengeUpdateManyMutationInput, PasswordResetChallengeUncheckedUpdateManyInput>
    /**
     * Filter which PasswordResetChallenges to update
     */
    where?: PasswordResetChallengeWhereInput
    /**
     * Limit how many PasswordResetChallenges to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetChallengeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PasswordResetChallenge upsert
   */
  export type PasswordResetChallengeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetChallenge
     */
    select?: PasswordResetChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetChallenge
     */
    omit?: PasswordResetChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetChallengeInclude<ExtArgs> | null
    /**
     * The filter to search for the PasswordResetChallenge to update in case it exists.
     */
    where: PasswordResetChallengeWhereUniqueInput
    /**
     * In case the PasswordResetChallenge found by the `where` argument doesn't exist, create a new PasswordResetChallenge with this data.
     */
    create: XOR<PasswordResetChallengeCreateInput, PasswordResetChallengeUncheckedCreateInput>
    /**
     * In case the PasswordResetChallenge was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PasswordResetChallengeUpdateInput, PasswordResetChallengeUncheckedUpdateInput>
  }

  /**
   * PasswordResetChallenge delete
   */
  export type PasswordResetChallengeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetChallenge
     */
    select?: PasswordResetChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetChallenge
     */
    omit?: PasswordResetChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetChallengeInclude<ExtArgs> | null
    /**
     * Filter which PasswordResetChallenge to delete.
     */
    where: PasswordResetChallengeWhereUniqueInput
  }

  /**
   * PasswordResetChallenge deleteMany
   */
  export type PasswordResetChallengeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordResetChallenges to delete
     */
    where?: PasswordResetChallengeWhereInput
    /**
     * Limit how many PasswordResetChallenges to delete.
     */
    limit?: number
  }

  /**
   * PasswordResetChallenge without action
   */
  export type PasswordResetChallengeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetChallenge
     */
    select?: PasswordResetChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetChallenge
     */
    omit?: PasswordResetChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetChallengeInclude<ExtArgs> | null
  }


  /**
   * Model RefreshSession
   */

  export type AggregateRefreshSession = {
    _count: RefreshSessionCountAggregateOutputType | null
    _min: RefreshSessionMinAggregateOutputType | null
    _max: RefreshSessionMaxAggregateOutputType | null
  }

  export type RefreshSessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    tokenHash: string | null
    expiresAt: Date | null
    revokedAt: Date | null
    createdAt: Date | null
  }

  export type RefreshSessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    tokenHash: string | null
    expiresAt: Date | null
    revokedAt: Date | null
    createdAt: Date | null
  }

  export type RefreshSessionCountAggregateOutputType = {
    id: number
    userId: number
    tokenHash: number
    expiresAt: number
    revokedAt: number
    createdAt: number
    _all: number
  }


  export type RefreshSessionMinAggregateInputType = {
    id?: true
    userId?: true
    tokenHash?: true
    expiresAt?: true
    revokedAt?: true
    createdAt?: true
  }

  export type RefreshSessionMaxAggregateInputType = {
    id?: true
    userId?: true
    tokenHash?: true
    expiresAt?: true
    revokedAt?: true
    createdAt?: true
  }

  export type RefreshSessionCountAggregateInputType = {
    id?: true
    userId?: true
    tokenHash?: true
    expiresAt?: true
    revokedAt?: true
    createdAt?: true
    _all?: true
  }

  export type RefreshSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RefreshSession to aggregate.
     */
    where?: RefreshSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshSessions to fetch.
     */
    orderBy?: RefreshSessionOrderByWithRelationInput | RefreshSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RefreshSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RefreshSessions
    **/
    _count?: true | RefreshSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RefreshSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RefreshSessionMaxAggregateInputType
  }

  export type GetRefreshSessionAggregateType<T extends RefreshSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateRefreshSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRefreshSession[P]>
      : GetScalarType<T[P], AggregateRefreshSession[P]>
  }




  export type RefreshSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RefreshSessionWhereInput
    orderBy?: RefreshSessionOrderByWithAggregationInput | RefreshSessionOrderByWithAggregationInput[]
    by: RefreshSessionScalarFieldEnum[] | RefreshSessionScalarFieldEnum
    having?: RefreshSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RefreshSessionCountAggregateInputType | true
    _min?: RefreshSessionMinAggregateInputType
    _max?: RefreshSessionMaxAggregateInputType
  }

  export type RefreshSessionGroupByOutputType = {
    id: string
    userId: string
    tokenHash: string
    expiresAt: Date
    revokedAt: Date | null
    createdAt: Date
    _count: RefreshSessionCountAggregateOutputType | null
    _min: RefreshSessionMinAggregateOutputType | null
    _max: RefreshSessionMaxAggregateOutputType | null
  }

  type GetRefreshSessionGroupByPayload<T extends RefreshSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RefreshSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RefreshSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RefreshSessionGroupByOutputType[P]>
            : GetScalarType<T[P], RefreshSessionGroupByOutputType[P]>
        }
      >
    >


  export type RefreshSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    expiresAt?: boolean
    revokedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshSession"]>

  export type RefreshSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    expiresAt?: boolean
    revokedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshSession"]>

  export type RefreshSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    expiresAt?: boolean
    revokedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshSession"]>

  export type RefreshSessionSelectScalar = {
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    expiresAt?: boolean
    revokedAt?: boolean
    createdAt?: boolean
  }

  export type RefreshSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "tokenHash" | "expiresAt" | "revokedAt" | "createdAt", ExtArgs["result"]["refreshSession"]>
  export type RefreshSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RefreshSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RefreshSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $RefreshSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RefreshSession"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      tokenHash: string
      expiresAt: Date
      revokedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["refreshSession"]>
    composites: {}
  }

  type RefreshSessionGetPayload<S extends boolean | null | undefined | RefreshSessionDefaultArgs> = $Result.GetResult<Prisma.$RefreshSessionPayload, S>

  type RefreshSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RefreshSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RefreshSessionCountAggregateInputType | true
    }

  export interface RefreshSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RefreshSession'], meta: { name: 'RefreshSession' } }
    /**
     * Find zero or one RefreshSession that matches the filter.
     * @param {RefreshSessionFindUniqueArgs} args - Arguments to find a RefreshSession
     * @example
     * // Get one RefreshSession
     * const refreshSession = await prisma.refreshSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RefreshSessionFindUniqueArgs>(args: SelectSubset<T, RefreshSessionFindUniqueArgs<ExtArgs>>): Prisma__RefreshSessionClient<$Result.GetResult<Prisma.$RefreshSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RefreshSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RefreshSessionFindUniqueOrThrowArgs} args - Arguments to find a RefreshSession
     * @example
     * // Get one RefreshSession
     * const refreshSession = await prisma.refreshSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RefreshSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, RefreshSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RefreshSessionClient<$Result.GetResult<Prisma.$RefreshSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RefreshSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshSessionFindFirstArgs} args - Arguments to find a RefreshSession
     * @example
     * // Get one RefreshSession
     * const refreshSession = await prisma.refreshSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RefreshSessionFindFirstArgs>(args?: SelectSubset<T, RefreshSessionFindFirstArgs<ExtArgs>>): Prisma__RefreshSessionClient<$Result.GetResult<Prisma.$RefreshSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RefreshSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshSessionFindFirstOrThrowArgs} args - Arguments to find a RefreshSession
     * @example
     * // Get one RefreshSession
     * const refreshSession = await prisma.refreshSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RefreshSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, RefreshSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__RefreshSessionClient<$Result.GetResult<Prisma.$RefreshSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RefreshSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RefreshSessions
     * const refreshSessions = await prisma.refreshSession.findMany()
     * 
     * // Get first 10 RefreshSessions
     * const refreshSessions = await prisma.refreshSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const refreshSessionWithIdOnly = await prisma.refreshSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RefreshSessionFindManyArgs>(args?: SelectSubset<T, RefreshSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RefreshSession.
     * @param {RefreshSessionCreateArgs} args - Arguments to create a RefreshSession.
     * @example
     * // Create one RefreshSession
     * const RefreshSession = await prisma.refreshSession.create({
     *   data: {
     *     // ... data to create a RefreshSession
     *   }
     * })
     * 
     */
    create<T extends RefreshSessionCreateArgs>(args: SelectSubset<T, RefreshSessionCreateArgs<ExtArgs>>): Prisma__RefreshSessionClient<$Result.GetResult<Prisma.$RefreshSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RefreshSessions.
     * @param {RefreshSessionCreateManyArgs} args - Arguments to create many RefreshSessions.
     * @example
     * // Create many RefreshSessions
     * const refreshSession = await prisma.refreshSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RefreshSessionCreateManyArgs>(args?: SelectSubset<T, RefreshSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RefreshSessions and returns the data saved in the database.
     * @param {RefreshSessionCreateManyAndReturnArgs} args - Arguments to create many RefreshSessions.
     * @example
     * // Create many RefreshSessions
     * const refreshSession = await prisma.refreshSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RefreshSessions and only return the `id`
     * const refreshSessionWithIdOnly = await prisma.refreshSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RefreshSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, RefreshSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RefreshSession.
     * @param {RefreshSessionDeleteArgs} args - Arguments to delete one RefreshSession.
     * @example
     * // Delete one RefreshSession
     * const RefreshSession = await prisma.refreshSession.delete({
     *   where: {
     *     // ... filter to delete one RefreshSession
     *   }
     * })
     * 
     */
    delete<T extends RefreshSessionDeleteArgs>(args: SelectSubset<T, RefreshSessionDeleteArgs<ExtArgs>>): Prisma__RefreshSessionClient<$Result.GetResult<Prisma.$RefreshSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RefreshSession.
     * @param {RefreshSessionUpdateArgs} args - Arguments to update one RefreshSession.
     * @example
     * // Update one RefreshSession
     * const refreshSession = await prisma.refreshSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RefreshSessionUpdateArgs>(args: SelectSubset<T, RefreshSessionUpdateArgs<ExtArgs>>): Prisma__RefreshSessionClient<$Result.GetResult<Prisma.$RefreshSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RefreshSessions.
     * @param {RefreshSessionDeleteManyArgs} args - Arguments to filter RefreshSessions to delete.
     * @example
     * // Delete a few RefreshSessions
     * const { count } = await prisma.refreshSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RefreshSessionDeleteManyArgs>(args?: SelectSubset<T, RefreshSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RefreshSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RefreshSessions
     * const refreshSession = await prisma.refreshSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RefreshSessionUpdateManyArgs>(args: SelectSubset<T, RefreshSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RefreshSessions and returns the data updated in the database.
     * @param {RefreshSessionUpdateManyAndReturnArgs} args - Arguments to update many RefreshSessions.
     * @example
     * // Update many RefreshSessions
     * const refreshSession = await prisma.refreshSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RefreshSessions and only return the `id`
     * const refreshSessionWithIdOnly = await prisma.refreshSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RefreshSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, RefreshSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RefreshSession.
     * @param {RefreshSessionUpsertArgs} args - Arguments to update or create a RefreshSession.
     * @example
     * // Update or create a RefreshSession
     * const refreshSession = await prisma.refreshSession.upsert({
     *   create: {
     *     // ... data to create a RefreshSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RefreshSession we want to update
     *   }
     * })
     */
    upsert<T extends RefreshSessionUpsertArgs>(args: SelectSubset<T, RefreshSessionUpsertArgs<ExtArgs>>): Prisma__RefreshSessionClient<$Result.GetResult<Prisma.$RefreshSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RefreshSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshSessionCountArgs} args - Arguments to filter RefreshSessions to count.
     * @example
     * // Count the number of RefreshSessions
     * const count = await prisma.refreshSession.count({
     *   where: {
     *     // ... the filter for the RefreshSessions we want to count
     *   }
     * })
    **/
    count<T extends RefreshSessionCountArgs>(
      args?: Subset<T, RefreshSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RefreshSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RefreshSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RefreshSessionAggregateArgs>(args: Subset<T, RefreshSessionAggregateArgs>): Prisma.PrismaPromise<GetRefreshSessionAggregateType<T>>

    /**
     * Group by RefreshSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RefreshSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RefreshSessionGroupByArgs['orderBy'] }
        : { orderBy?: RefreshSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RefreshSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRefreshSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RefreshSession model
   */
  readonly fields: RefreshSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RefreshSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RefreshSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RefreshSession model
   */
  interface RefreshSessionFieldRefs {
    readonly id: FieldRef<"RefreshSession", 'String'>
    readonly userId: FieldRef<"RefreshSession", 'String'>
    readonly tokenHash: FieldRef<"RefreshSession", 'String'>
    readonly expiresAt: FieldRef<"RefreshSession", 'DateTime'>
    readonly revokedAt: FieldRef<"RefreshSession", 'DateTime'>
    readonly createdAt: FieldRef<"RefreshSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RefreshSession findUnique
   */
  export type RefreshSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshSession
     */
    select?: RefreshSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshSession
     */
    omit?: RefreshSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshSessionInclude<ExtArgs> | null
    /**
     * Filter, which RefreshSession to fetch.
     */
    where: RefreshSessionWhereUniqueInput
  }

  /**
   * RefreshSession findUniqueOrThrow
   */
  export type RefreshSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshSession
     */
    select?: RefreshSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshSession
     */
    omit?: RefreshSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshSessionInclude<ExtArgs> | null
    /**
     * Filter, which RefreshSession to fetch.
     */
    where: RefreshSessionWhereUniqueInput
  }

  /**
   * RefreshSession findFirst
   */
  export type RefreshSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshSession
     */
    select?: RefreshSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshSession
     */
    omit?: RefreshSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshSessionInclude<ExtArgs> | null
    /**
     * Filter, which RefreshSession to fetch.
     */
    where?: RefreshSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshSessions to fetch.
     */
    orderBy?: RefreshSessionOrderByWithRelationInput | RefreshSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RefreshSessions.
     */
    cursor?: RefreshSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RefreshSessions.
     */
    distinct?: RefreshSessionScalarFieldEnum | RefreshSessionScalarFieldEnum[]
  }

  /**
   * RefreshSession findFirstOrThrow
   */
  export type RefreshSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshSession
     */
    select?: RefreshSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshSession
     */
    omit?: RefreshSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshSessionInclude<ExtArgs> | null
    /**
     * Filter, which RefreshSession to fetch.
     */
    where?: RefreshSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshSessions to fetch.
     */
    orderBy?: RefreshSessionOrderByWithRelationInput | RefreshSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RefreshSessions.
     */
    cursor?: RefreshSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RefreshSessions.
     */
    distinct?: RefreshSessionScalarFieldEnum | RefreshSessionScalarFieldEnum[]
  }

  /**
   * RefreshSession findMany
   */
  export type RefreshSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshSession
     */
    select?: RefreshSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshSession
     */
    omit?: RefreshSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshSessionInclude<ExtArgs> | null
    /**
     * Filter, which RefreshSessions to fetch.
     */
    where?: RefreshSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshSessions to fetch.
     */
    orderBy?: RefreshSessionOrderByWithRelationInput | RefreshSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RefreshSessions.
     */
    cursor?: RefreshSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RefreshSessions.
     */
    distinct?: RefreshSessionScalarFieldEnum | RefreshSessionScalarFieldEnum[]
  }

  /**
   * RefreshSession create
   */
  export type RefreshSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshSession
     */
    select?: RefreshSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshSession
     */
    omit?: RefreshSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a RefreshSession.
     */
    data: XOR<RefreshSessionCreateInput, RefreshSessionUncheckedCreateInput>
  }

  /**
   * RefreshSession createMany
   */
  export type RefreshSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RefreshSessions.
     */
    data: RefreshSessionCreateManyInput | RefreshSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RefreshSession createManyAndReturn
   */
  export type RefreshSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshSession
     */
    select?: RefreshSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshSession
     */
    omit?: RefreshSessionOmit<ExtArgs> | null
    /**
     * The data used to create many RefreshSessions.
     */
    data: RefreshSessionCreateManyInput | RefreshSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RefreshSession update
   */
  export type RefreshSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshSession
     */
    select?: RefreshSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshSession
     */
    omit?: RefreshSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a RefreshSession.
     */
    data: XOR<RefreshSessionUpdateInput, RefreshSessionUncheckedUpdateInput>
    /**
     * Choose, which RefreshSession to update.
     */
    where: RefreshSessionWhereUniqueInput
  }

  /**
   * RefreshSession updateMany
   */
  export type RefreshSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RefreshSessions.
     */
    data: XOR<RefreshSessionUpdateManyMutationInput, RefreshSessionUncheckedUpdateManyInput>
    /**
     * Filter which RefreshSessions to update
     */
    where?: RefreshSessionWhereInput
    /**
     * Limit how many RefreshSessions to update.
     */
    limit?: number
  }

  /**
   * RefreshSession updateManyAndReturn
   */
  export type RefreshSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshSession
     */
    select?: RefreshSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshSession
     */
    omit?: RefreshSessionOmit<ExtArgs> | null
    /**
     * The data used to update RefreshSessions.
     */
    data: XOR<RefreshSessionUpdateManyMutationInput, RefreshSessionUncheckedUpdateManyInput>
    /**
     * Filter which RefreshSessions to update
     */
    where?: RefreshSessionWhereInput
    /**
     * Limit how many RefreshSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RefreshSession upsert
   */
  export type RefreshSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshSession
     */
    select?: RefreshSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshSession
     */
    omit?: RefreshSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the RefreshSession to update in case it exists.
     */
    where: RefreshSessionWhereUniqueInput
    /**
     * In case the RefreshSession found by the `where` argument doesn't exist, create a new RefreshSession with this data.
     */
    create: XOR<RefreshSessionCreateInput, RefreshSessionUncheckedCreateInput>
    /**
     * In case the RefreshSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RefreshSessionUpdateInput, RefreshSessionUncheckedUpdateInput>
  }

  /**
   * RefreshSession delete
   */
  export type RefreshSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshSession
     */
    select?: RefreshSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshSession
     */
    omit?: RefreshSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshSessionInclude<ExtArgs> | null
    /**
     * Filter which RefreshSession to delete.
     */
    where: RefreshSessionWhereUniqueInput
  }

  /**
   * RefreshSession deleteMany
   */
  export type RefreshSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RefreshSessions to delete
     */
    where?: RefreshSessionWhereInput
    /**
     * Limit how many RefreshSessions to delete.
     */
    limit?: number
  }

  /**
   * RefreshSession without action
   */
  export type RefreshSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshSession
     */
    select?: RefreshSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshSession
     */
    omit?: RefreshSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshSessionInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    firstName: 'firstName',
    lastName: 'lastName',
    username: 'username',
    displayName: 'displayName',
    phone: 'phone',
    country: 'country',
    countryCode: 'countryCode',
    gender: 'gender',
    dateOfBirth: 'dateOfBirth',
    bio: 'bio',
    address: 'address',
    profileImageUrl: 'profileImageUrl',
    isEmailVerified: 'isEmailVerified',
    isProfileComplete: 'isProfileComplete',
    isVerified: 'isVerified',
    isActive: 'isActive',
    role: 'role',
    transactionPinHash: 'transactionPinHash',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const PendingRegistrationScalarFieldEnum: {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    firstName: 'firstName',
    lastName: 'lastName',
    phone: 'phone',
    country: 'country',
    countryCode: 'countryCode',
    gender: 'gender',
    otpHash: 'otpHash',
    otpExpiresAt: 'otpExpiresAt',
    otpAttempts: 'otpAttempts',
    lastOtpSentAt: 'lastOtpSentAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    existingUserId: 'existingUserId'
  };

  export type PendingRegistrationScalarFieldEnum = (typeof PendingRegistrationScalarFieldEnum)[keyof typeof PendingRegistrationScalarFieldEnum]


  export const PasswordResetChallengeScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    codeHash: 'codeHash',
    expiresAt: 'expiresAt',
    attempts: 'attempts',
    consumedAt: 'consumedAt',
    createdAt: 'createdAt'
  };

  export type PasswordResetChallengeScalarFieldEnum = (typeof PasswordResetChallengeScalarFieldEnum)[keyof typeof PasswordResetChallengeScalarFieldEnum]


  export const RefreshSessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    tokenHash: 'tokenHash',
    expiresAt: 'expiresAt',
    revokedAt: 'revokedAt',
    createdAt: 'createdAt'
  };

  export type RefreshSessionScalarFieldEnum = (typeof RefreshSessionScalarFieldEnum)[keyof typeof RefreshSessionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    firstName?: StringFilter<"User"> | string
    lastName?: StringFilter<"User"> | string
    username?: StringNullableFilter<"User"> | string | null
    displayName?: StringNullableFilter<"User"> | string | null
    phone?: StringNullableFilter<"User"> | string | null
    country?: StringNullableFilter<"User"> | string | null
    countryCode?: StringNullableFilter<"User"> | string | null
    gender?: StringNullableFilter<"User"> | string | null
    dateOfBirth?: DateTimeNullableFilter<"User"> | Date | string | null
    bio?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    profileImageUrl?: StringNullableFilter<"User"> | string | null
    isEmailVerified?: BoolFilter<"User"> | boolean
    isProfileComplete?: BoolFilter<"User"> | boolean
    isVerified?: BoolFilter<"User"> | boolean
    isActive?: BoolFilter<"User"> | boolean
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    transactionPinHash?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    passwordResets?: PasswordResetChallengeListRelationFilter
    pendingVerification?: XOR<PendingRegistrationNullableScalarRelationFilter, PendingRegistrationWhereInput> | null
    refreshSessions?: RefreshSessionListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    username?: SortOrderInput | SortOrder
    displayName?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    countryCode?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    dateOfBirth?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    profileImageUrl?: SortOrderInput | SortOrder
    isEmailVerified?: SortOrder
    isProfileComplete?: SortOrder
    isVerified?: SortOrder
    isActive?: SortOrder
    role?: SortOrder
    transactionPinHash?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    passwordResets?: PasswordResetChallengeOrderByRelationAggregateInput
    pendingVerification?: PendingRegistrationOrderByWithRelationInput
    refreshSessions?: RefreshSessionOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    username?: string
    phone?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    firstName?: StringFilter<"User"> | string
    lastName?: StringFilter<"User"> | string
    displayName?: StringNullableFilter<"User"> | string | null
    country?: StringNullableFilter<"User"> | string | null
    countryCode?: StringNullableFilter<"User"> | string | null
    gender?: StringNullableFilter<"User"> | string | null
    dateOfBirth?: DateTimeNullableFilter<"User"> | Date | string | null
    bio?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    profileImageUrl?: StringNullableFilter<"User"> | string | null
    isEmailVerified?: BoolFilter<"User"> | boolean
    isProfileComplete?: BoolFilter<"User"> | boolean
    isVerified?: BoolFilter<"User"> | boolean
    isActive?: BoolFilter<"User"> | boolean
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    transactionPinHash?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    passwordResets?: PasswordResetChallengeListRelationFilter
    pendingVerification?: XOR<PendingRegistrationNullableScalarRelationFilter, PendingRegistrationWhereInput> | null
    refreshSessions?: RefreshSessionListRelationFilter
  }, "id" | "email" | "username" | "phone">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    username?: SortOrderInput | SortOrder
    displayName?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    countryCode?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    dateOfBirth?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    profileImageUrl?: SortOrderInput | SortOrder
    isEmailVerified?: SortOrder
    isProfileComplete?: SortOrder
    isVerified?: SortOrder
    isActive?: SortOrder
    role?: SortOrder
    transactionPinHash?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    firstName?: StringWithAggregatesFilter<"User"> | string
    lastName?: StringWithAggregatesFilter<"User"> | string
    username?: StringNullableWithAggregatesFilter<"User"> | string | null
    displayName?: StringNullableWithAggregatesFilter<"User"> | string | null
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    country?: StringNullableWithAggregatesFilter<"User"> | string | null
    countryCode?: StringNullableWithAggregatesFilter<"User"> | string | null
    gender?: StringNullableWithAggregatesFilter<"User"> | string | null
    dateOfBirth?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    bio?: StringNullableWithAggregatesFilter<"User"> | string | null
    address?: StringNullableWithAggregatesFilter<"User"> | string | null
    profileImageUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    isEmailVerified?: BoolWithAggregatesFilter<"User"> | boolean
    isProfileComplete?: BoolWithAggregatesFilter<"User"> | boolean
    isVerified?: BoolWithAggregatesFilter<"User"> | boolean
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    transactionPinHash?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type PendingRegistrationWhereInput = {
    AND?: PendingRegistrationWhereInput | PendingRegistrationWhereInput[]
    OR?: PendingRegistrationWhereInput[]
    NOT?: PendingRegistrationWhereInput | PendingRegistrationWhereInput[]
    id?: StringFilter<"PendingRegistration"> | string
    email?: StringFilter<"PendingRegistration"> | string
    passwordHash?: StringFilter<"PendingRegistration"> | string
    firstName?: StringFilter<"PendingRegistration"> | string
    lastName?: StringFilter<"PendingRegistration"> | string
    phone?: StringNullableFilter<"PendingRegistration"> | string | null
    country?: StringNullableFilter<"PendingRegistration"> | string | null
    countryCode?: StringNullableFilter<"PendingRegistration"> | string | null
    gender?: StringNullableFilter<"PendingRegistration"> | string | null
    otpHash?: StringFilter<"PendingRegistration"> | string
    otpExpiresAt?: DateTimeFilter<"PendingRegistration"> | Date | string
    otpAttempts?: IntFilter<"PendingRegistration"> | number
    lastOtpSentAt?: DateTimeNullableFilter<"PendingRegistration"> | Date | string | null
    createdAt?: DateTimeFilter<"PendingRegistration"> | Date | string
    updatedAt?: DateTimeFilter<"PendingRegistration"> | Date | string
    existingUserId?: StringNullableFilter<"PendingRegistration"> | string | null
    existingUser?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type PendingRegistrationOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    countryCode?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    otpHash?: SortOrder
    otpExpiresAt?: SortOrder
    otpAttempts?: SortOrder
    lastOtpSentAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    existingUserId?: SortOrderInput | SortOrder
    existingUser?: UserOrderByWithRelationInput
  }

  export type PendingRegistrationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    existingUserId?: string
    AND?: PendingRegistrationWhereInput | PendingRegistrationWhereInput[]
    OR?: PendingRegistrationWhereInput[]
    NOT?: PendingRegistrationWhereInput | PendingRegistrationWhereInput[]
    passwordHash?: StringFilter<"PendingRegistration"> | string
    firstName?: StringFilter<"PendingRegistration"> | string
    lastName?: StringFilter<"PendingRegistration"> | string
    phone?: StringNullableFilter<"PendingRegistration"> | string | null
    country?: StringNullableFilter<"PendingRegistration"> | string | null
    countryCode?: StringNullableFilter<"PendingRegistration"> | string | null
    gender?: StringNullableFilter<"PendingRegistration"> | string | null
    otpHash?: StringFilter<"PendingRegistration"> | string
    otpExpiresAt?: DateTimeFilter<"PendingRegistration"> | Date | string
    otpAttempts?: IntFilter<"PendingRegistration"> | number
    lastOtpSentAt?: DateTimeNullableFilter<"PendingRegistration"> | Date | string | null
    createdAt?: DateTimeFilter<"PendingRegistration"> | Date | string
    updatedAt?: DateTimeFilter<"PendingRegistration"> | Date | string
    existingUser?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id" | "email" | "existingUserId">

  export type PendingRegistrationOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    countryCode?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    otpHash?: SortOrder
    otpExpiresAt?: SortOrder
    otpAttempts?: SortOrder
    lastOtpSentAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    existingUserId?: SortOrderInput | SortOrder
    _count?: PendingRegistrationCountOrderByAggregateInput
    _avg?: PendingRegistrationAvgOrderByAggregateInput
    _max?: PendingRegistrationMaxOrderByAggregateInput
    _min?: PendingRegistrationMinOrderByAggregateInput
    _sum?: PendingRegistrationSumOrderByAggregateInput
  }

  export type PendingRegistrationScalarWhereWithAggregatesInput = {
    AND?: PendingRegistrationScalarWhereWithAggregatesInput | PendingRegistrationScalarWhereWithAggregatesInput[]
    OR?: PendingRegistrationScalarWhereWithAggregatesInput[]
    NOT?: PendingRegistrationScalarWhereWithAggregatesInput | PendingRegistrationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PendingRegistration"> | string
    email?: StringWithAggregatesFilter<"PendingRegistration"> | string
    passwordHash?: StringWithAggregatesFilter<"PendingRegistration"> | string
    firstName?: StringWithAggregatesFilter<"PendingRegistration"> | string
    lastName?: StringWithAggregatesFilter<"PendingRegistration"> | string
    phone?: StringNullableWithAggregatesFilter<"PendingRegistration"> | string | null
    country?: StringNullableWithAggregatesFilter<"PendingRegistration"> | string | null
    countryCode?: StringNullableWithAggregatesFilter<"PendingRegistration"> | string | null
    gender?: StringNullableWithAggregatesFilter<"PendingRegistration"> | string | null
    otpHash?: StringWithAggregatesFilter<"PendingRegistration"> | string
    otpExpiresAt?: DateTimeWithAggregatesFilter<"PendingRegistration"> | Date | string
    otpAttempts?: IntWithAggregatesFilter<"PendingRegistration"> | number
    lastOtpSentAt?: DateTimeNullableWithAggregatesFilter<"PendingRegistration"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PendingRegistration"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PendingRegistration"> | Date | string
    existingUserId?: StringNullableWithAggregatesFilter<"PendingRegistration"> | string | null
  }

  export type PasswordResetChallengeWhereInput = {
    AND?: PasswordResetChallengeWhereInput | PasswordResetChallengeWhereInput[]
    OR?: PasswordResetChallengeWhereInput[]
    NOT?: PasswordResetChallengeWhereInput | PasswordResetChallengeWhereInput[]
    id?: StringFilter<"PasswordResetChallenge"> | string
    userId?: StringFilter<"PasswordResetChallenge"> | string
    codeHash?: StringFilter<"PasswordResetChallenge"> | string
    expiresAt?: DateTimeFilter<"PasswordResetChallenge"> | Date | string
    attempts?: IntFilter<"PasswordResetChallenge"> | number
    consumedAt?: DateTimeNullableFilter<"PasswordResetChallenge"> | Date | string | null
    createdAt?: DateTimeFilter<"PasswordResetChallenge"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PasswordResetChallengeOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    codeHash?: SortOrder
    expiresAt?: SortOrder
    attempts?: SortOrder
    consumedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type PasswordResetChallengeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PasswordResetChallengeWhereInput | PasswordResetChallengeWhereInput[]
    OR?: PasswordResetChallengeWhereInput[]
    NOT?: PasswordResetChallengeWhereInput | PasswordResetChallengeWhereInput[]
    userId?: StringFilter<"PasswordResetChallenge"> | string
    codeHash?: StringFilter<"PasswordResetChallenge"> | string
    expiresAt?: DateTimeFilter<"PasswordResetChallenge"> | Date | string
    attempts?: IntFilter<"PasswordResetChallenge"> | number
    consumedAt?: DateTimeNullableFilter<"PasswordResetChallenge"> | Date | string | null
    createdAt?: DateTimeFilter<"PasswordResetChallenge"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type PasswordResetChallengeOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    codeHash?: SortOrder
    expiresAt?: SortOrder
    attempts?: SortOrder
    consumedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: PasswordResetChallengeCountOrderByAggregateInput
    _avg?: PasswordResetChallengeAvgOrderByAggregateInput
    _max?: PasswordResetChallengeMaxOrderByAggregateInput
    _min?: PasswordResetChallengeMinOrderByAggregateInput
    _sum?: PasswordResetChallengeSumOrderByAggregateInput
  }

  export type PasswordResetChallengeScalarWhereWithAggregatesInput = {
    AND?: PasswordResetChallengeScalarWhereWithAggregatesInput | PasswordResetChallengeScalarWhereWithAggregatesInput[]
    OR?: PasswordResetChallengeScalarWhereWithAggregatesInput[]
    NOT?: PasswordResetChallengeScalarWhereWithAggregatesInput | PasswordResetChallengeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PasswordResetChallenge"> | string
    userId?: StringWithAggregatesFilter<"PasswordResetChallenge"> | string
    codeHash?: StringWithAggregatesFilter<"PasswordResetChallenge"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"PasswordResetChallenge"> | Date | string
    attempts?: IntWithAggregatesFilter<"PasswordResetChallenge"> | number
    consumedAt?: DateTimeNullableWithAggregatesFilter<"PasswordResetChallenge"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PasswordResetChallenge"> | Date | string
  }

  export type RefreshSessionWhereInput = {
    AND?: RefreshSessionWhereInput | RefreshSessionWhereInput[]
    OR?: RefreshSessionWhereInput[]
    NOT?: RefreshSessionWhereInput | RefreshSessionWhereInput[]
    id?: StringFilter<"RefreshSession"> | string
    userId?: StringFilter<"RefreshSession"> | string
    tokenHash?: StringFilter<"RefreshSession"> | string
    expiresAt?: DateTimeFilter<"RefreshSession"> | Date | string
    revokedAt?: DateTimeNullableFilter<"RefreshSession"> | Date | string | null
    createdAt?: DateTimeFilter<"RefreshSession"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type RefreshSessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type RefreshSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tokenHash?: string
    AND?: RefreshSessionWhereInput | RefreshSessionWhereInput[]
    OR?: RefreshSessionWhereInput[]
    NOT?: RefreshSessionWhereInput | RefreshSessionWhereInput[]
    userId?: StringFilter<"RefreshSession"> | string
    expiresAt?: DateTimeFilter<"RefreshSession"> | Date | string
    revokedAt?: DateTimeNullableFilter<"RefreshSession"> | Date | string | null
    createdAt?: DateTimeFilter<"RefreshSession"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "tokenHash">

  export type RefreshSessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: RefreshSessionCountOrderByAggregateInput
    _max?: RefreshSessionMaxOrderByAggregateInput
    _min?: RefreshSessionMinOrderByAggregateInput
  }

  export type RefreshSessionScalarWhereWithAggregatesInput = {
    AND?: RefreshSessionScalarWhereWithAggregatesInput | RefreshSessionScalarWhereWithAggregatesInput[]
    OR?: RefreshSessionScalarWhereWithAggregatesInput[]
    NOT?: RefreshSessionScalarWhereWithAggregatesInput | RefreshSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RefreshSession"> | string
    userId?: StringWithAggregatesFilter<"RefreshSession"> | string
    tokenHash?: StringWithAggregatesFilter<"RefreshSession"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"RefreshSession"> | Date | string
    revokedAt?: DateTimeNullableWithAggregatesFilter<"RefreshSession"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"RefreshSession"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    username?: string | null
    displayName?: string | null
    phone?: string | null
    country?: string | null
    countryCode?: string | null
    gender?: string | null
    dateOfBirth?: Date | string | null
    bio?: string | null
    address?: string | null
    profileImageUrl?: string | null
    isEmailVerified?: boolean
    isProfileComplete?: boolean
    isVerified?: boolean
    isActive?: boolean
    role?: $Enums.UserRole
    transactionPinHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordResets?: PasswordResetChallengeCreateNestedManyWithoutUserInput
    pendingVerification?: PendingRegistrationCreateNestedOneWithoutExistingUserInput
    refreshSessions?: RefreshSessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    username?: string | null
    displayName?: string | null
    phone?: string | null
    country?: string | null
    countryCode?: string | null
    gender?: string | null
    dateOfBirth?: Date | string | null
    bio?: string | null
    address?: string | null
    profileImageUrl?: string | null
    isEmailVerified?: boolean
    isProfileComplete?: boolean
    isVerified?: boolean
    isActive?: boolean
    role?: $Enums.UserRole
    transactionPinHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordResets?: PasswordResetChallengeUncheckedCreateNestedManyWithoutUserInput
    pendingVerification?: PendingRegistrationUncheckedCreateNestedOneWithoutExistingUserInput
    refreshSessions?: RefreshSessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    isProfileComplete?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    transactionPinHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordResets?: PasswordResetChallengeUpdateManyWithoutUserNestedInput
    pendingVerification?: PendingRegistrationUpdateOneWithoutExistingUserNestedInput
    refreshSessions?: RefreshSessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    isProfileComplete?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    transactionPinHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordResets?: PasswordResetChallengeUncheckedUpdateManyWithoutUserNestedInput
    pendingVerification?: PendingRegistrationUncheckedUpdateOneWithoutExistingUserNestedInput
    refreshSessions?: RefreshSessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    username?: string | null
    displayName?: string | null
    phone?: string | null
    country?: string | null
    countryCode?: string | null
    gender?: string | null
    dateOfBirth?: Date | string | null
    bio?: string | null
    address?: string | null
    profileImageUrl?: string | null
    isEmailVerified?: boolean
    isProfileComplete?: boolean
    isVerified?: boolean
    isActive?: boolean
    role?: $Enums.UserRole
    transactionPinHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    isProfileComplete?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    transactionPinHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    isProfileComplete?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    transactionPinHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PendingRegistrationCreateInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    phone?: string | null
    country?: string | null
    countryCode?: string | null
    gender?: string | null
    otpHash: string
    otpExpiresAt: Date | string
    otpAttempts?: number
    lastOtpSentAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    existingUser?: UserCreateNestedOneWithoutPendingVerificationInput
  }

  export type PendingRegistrationUncheckedCreateInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    phone?: string | null
    country?: string | null
    countryCode?: string | null
    gender?: string | null
    otpHash: string
    otpExpiresAt: Date | string
    otpAttempts?: number
    lastOtpSentAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    existingUserId?: string | null
  }

  export type PendingRegistrationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    otpHash?: StringFieldUpdateOperationsInput | string
    otpExpiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    otpAttempts?: IntFieldUpdateOperationsInput | number
    lastOtpSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    existingUser?: UserUpdateOneWithoutPendingVerificationNestedInput
  }

  export type PendingRegistrationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    otpHash?: StringFieldUpdateOperationsInput | string
    otpExpiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    otpAttempts?: IntFieldUpdateOperationsInput | number
    lastOtpSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    existingUserId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PendingRegistrationCreateManyInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    phone?: string | null
    country?: string | null
    countryCode?: string | null
    gender?: string | null
    otpHash: string
    otpExpiresAt: Date | string
    otpAttempts?: number
    lastOtpSentAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    existingUserId?: string | null
  }

  export type PendingRegistrationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    otpHash?: StringFieldUpdateOperationsInput | string
    otpExpiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    otpAttempts?: IntFieldUpdateOperationsInput | number
    lastOtpSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PendingRegistrationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    otpHash?: StringFieldUpdateOperationsInput | string
    otpExpiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    otpAttempts?: IntFieldUpdateOperationsInput | number
    lastOtpSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    existingUserId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PasswordResetChallengeCreateInput = {
    id?: string
    codeHash: string
    expiresAt: Date | string
    attempts?: number
    consumedAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPasswordResetsInput
  }

  export type PasswordResetChallengeUncheckedCreateInput = {
    id?: string
    userId: string
    codeHash: string
    expiresAt: Date | string
    attempts?: number
    consumedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PasswordResetChallengeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attempts?: IntFieldUpdateOperationsInput | number
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPasswordResetsNestedInput
  }

  export type PasswordResetChallengeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attempts?: IntFieldUpdateOperationsInput | number
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetChallengeCreateManyInput = {
    id?: string
    userId: string
    codeHash: string
    expiresAt: Date | string
    attempts?: number
    consumedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PasswordResetChallengeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attempts?: IntFieldUpdateOperationsInput | number
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetChallengeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attempts?: IntFieldUpdateOperationsInput | number
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshSessionCreateInput = {
    id?: string
    tokenHash: string
    expiresAt: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutRefreshSessionsInput
  }

  export type RefreshSessionUncheckedCreateInput = {
    id?: string
    userId: string
    tokenHash: string
    expiresAt: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type RefreshSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutRefreshSessionsNestedInput
  }

  export type RefreshSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshSessionCreateManyInput = {
    id?: string
    userId: string
    tokenHash: string
    expiresAt: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type RefreshSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type PasswordResetChallengeListRelationFilter = {
    every?: PasswordResetChallengeWhereInput
    some?: PasswordResetChallengeWhereInput
    none?: PasswordResetChallengeWhereInput
  }

  export type PendingRegistrationNullableScalarRelationFilter = {
    is?: PendingRegistrationWhereInput | null
    isNot?: PendingRegistrationWhereInput | null
  }

  export type RefreshSessionListRelationFilter = {
    every?: RefreshSessionWhereInput
    some?: RefreshSessionWhereInput
    none?: RefreshSessionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PasswordResetChallengeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RefreshSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    username?: SortOrder
    displayName?: SortOrder
    phone?: SortOrder
    country?: SortOrder
    countryCode?: SortOrder
    gender?: SortOrder
    dateOfBirth?: SortOrder
    bio?: SortOrder
    address?: SortOrder
    profileImageUrl?: SortOrder
    isEmailVerified?: SortOrder
    isProfileComplete?: SortOrder
    isVerified?: SortOrder
    isActive?: SortOrder
    role?: SortOrder
    transactionPinHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    username?: SortOrder
    displayName?: SortOrder
    phone?: SortOrder
    country?: SortOrder
    countryCode?: SortOrder
    gender?: SortOrder
    dateOfBirth?: SortOrder
    bio?: SortOrder
    address?: SortOrder
    profileImageUrl?: SortOrder
    isEmailVerified?: SortOrder
    isProfileComplete?: SortOrder
    isVerified?: SortOrder
    isActive?: SortOrder
    role?: SortOrder
    transactionPinHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    username?: SortOrder
    displayName?: SortOrder
    phone?: SortOrder
    country?: SortOrder
    countryCode?: SortOrder
    gender?: SortOrder
    dateOfBirth?: SortOrder
    bio?: SortOrder
    address?: SortOrder
    profileImageUrl?: SortOrder
    isEmailVerified?: SortOrder
    isProfileComplete?: SortOrder
    isVerified?: SortOrder
    isActive?: SortOrder
    role?: SortOrder
    transactionPinHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type PendingRegistrationCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    country?: SortOrder
    countryCode?: SortOrder
    gender?: SortOrder
    otpHash?: SortOrder
    otpExpiresAt?: SortOrder
    otpAttempts?: SortOrder
    lastOtpSentAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    existingUserId?: SortOrder
  }

  export type PendingRegistrationAvgOrderByAggregateInput = {
    otpAttempts?: SortOrder
  }

  export type PendingRegistrationMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    country?: SortOrder
    countryCode?: SortOrder
    gender?: SortOrder
    otpHash?: SortOrder
    otpExpiresAt?: SortOrder
    otpAttempts?: SortOrder
    lastOtpSentAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    existingUserId?: SortOrder
  }

  export type PendingRegistrationMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    country?: SortOrder
    countryCode?: SortOrder
    gender?: SortOrder
    otpHash?: SortOrder
    otpExpiresAt?: SortOrder
    otpAttempts?: SortOrder
    lastOtpSentAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    existingUserId?: SortOrder
  }

  export type PendingRegistrationSumOrderByAggregateInput = {
    otpAttempts?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type PasswordResetChallengeCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    codeHash?: SortOrder
    expiresAt?: SortOrder
    attempts?: SortOrder
    consumedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetChallengeAvgOrderByAggregateInput = {
    attempts?: SortOrder
  }

  export type PasswordResetChallengeMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    codeHash?: SortOrder
    expiresAt?: SortOrder
    attempts?: SortOrder
    consumedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetChallengeMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    codeHash?: SortOrder
    expiresAt?: SortOrder
    attempts?: SortOrder
    consumedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetChallengeSumOrderByAggregateInput = {
    attempts?: SortOrder
  }

  export type RefreshSessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    revokedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RefreshSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    revokedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RefreshSessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    revokedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetChallengeCreateNestedManyWithoutUserInput = {
    create?: XOR<PasswordResetChallengeCreateWithoutUserInput, PasswordResetChallengeUncheckedCreateWithoutUserInput> | PasswordResetChallengeCreateWithoutUserInput[] | PasswordResetChallengeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetChallengeCreateOrConnectWithoutUserInput | PasswordResetChallengeCreateOrConnectWithoutUserInput[]
    createMany?: PasswordResetChallengeCreateManyUserInputEnvelope
    connect?: PasswordResetChallengeWhereUniqueInput | PasswordResetChallengeWhereUniqueInput[]
  }

  export type PendingRegistrationCreateNestedOneWithoutExistingUserInput = {
    create?: XOR<PendingRegistrationCreateWithoutExistingUserInput, PendingRegistrationUncheckedCreateWithoutExistingUserInput>
    connectOrCreate?: PendingRegistrationCreateOrConnectWithoutExistingUserInput
    connect?: PendingRegistrationWhereUniqueInput
  }

  export type RefreshSessionCreateNestedManyWithoutUserInput = {
    create?: XOR<RefreshSessionCreateWithoutUserInput, RefreshSessionUncheckedCreateWithoutUserInput> | RefreshSessionCreateWithoutUserInput[] | RefreshSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshSessionCreateOrConnectWithoutUserInput | RefreshSessionCreateOrConnectWithoutUserInput[]
    createMany?: RefreshSessionCreateManyUserInputEnvelope
    connect?: RefreshSessionWhereUniqueInput | RefreshSessionWhereUniqueInput[]
  }

  export type PasswordResetChallengeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PasswordResetChallengeCreateWithoutUserInput, PasswordResetChallengeUncheckedCreateWithoutUserInput> | PasswordResetChallengeCreateWithoutUserInput[] | PasswordResetChallengeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetChallengeCreateOrConnectWithoutUserInput | PasswordResetChallengeCreateOrConnectWithoutUserInput[]
    createMany?: PasswordResetChallengeCreateManyUserInputEnvelope
    connect?: PasswordResetChallengeWhereUniqueInput | PasswordResetChallengeWhereUniqueInput[]
  }

  export type PendingRegistrationUncheckedCreateNestedOneWithoutExistingUserInput = {
    create?: XOR<PendingRegistrationCreateWithoutExistingUserInput, PendingRegistrationUncheckedCreateWithoutExistingUserInput>
    connectOrCreate?: PendingRegistrationCreateOrConnectWithoutExistingUserInput
    connect?: PendingRegistrationWhereUniqueInput
  }

  export type RefreshSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<RefreshSessionCreateWithoutUserInput, RefreshSessionUncheckedCreateWithoutUserInput> | RefreshSessionCreateWithoutUserInput[] | RefreshSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshSessionCreateOrConnectWithoutUserInput | RefreshSessionCreateOrConnectWithoutUserInput[]
    createMany?: RefreshSessionCreateManyUserInputEnvelope
    connect?: RefreshSessionWhereUniqueInput | RefreshSessionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PasswordResetChallengeUpdateManyWithoutUserNestedInput = {
    create?: XOR<PasswordResetChallengeCreateWithoutUserInput, PasswordResetChallengeUncheckedCreateWithoutUserInput> | PasswordResetChallengeCreateWithoutUserInput[] | PasswordResetChallengeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetChallengeCreateOrConnectWithoutUserInput | PasswordResetChallengeCreateOrConnectWithoutUserInput[]
    upsert?: PasswordResetChallengeUpsertWithWhereUniqueWithoutUserInput | PasswordResetChallengeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PasswordResetChallengeCreateManyUserInputEnvelope
    set?: PasswordResetChallengeWhereUniqueInput | PasswordResetChallengeWhereUniqueInput[]
    disconnect?: PasswordResetChallengeWhereUniqueInput | PasswordResetChallengeWhereUniqueInput[]
    delete?: PasswordResetChallengeWhereUniqueInput | PasswordResetChallengeWhereUniqueInput[]
    connect?: PasswordResetChallengeWhereUniqueInput | PasswordResetChallengeWhereUniqueInput[]
    update?: PasswordResetChallengeUpdateWithWhereUniqueWithoutUserInput | PasswordResetChallengeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PasswordResetChallengeUpdateManyWithWhereWithoutUserInput | PasswordResetChallengeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PasswordResetChallengeScalarWhereInput | PasswordResetChallengeScalarWhereInput[]
  }

  export type PendingRegistrationUpdateOneWithoutExistingUserNestedInput = {
    create?: XOR<PendingRegistrationCreateWithoutExistingUserInput, PendingRegistrationUncheckedCreateWithoutExistingUserInput>
    connectOrCreate?: PendingRegistrationCreateOrConnectWithoutExistingUserInput
    upsert?: PendingRegistrationUpsertWithoutExistingUserInput
    disconnect?: PendingRegistrationWhereInput | boolean
    delete?: PendingRegistrationWhereInput | boolean
    connect?: PendingRegistrationWhereUniqueInput
    update?: XOR<XOR<PendingRegistrationUpdateToOneWithWhereWithoutExistingUserInput, PendingRegistrationUpdateWithoutExistingUserInput>, PendingRegistrationUncheckedUpdateWithoutExistingUserInput>
  }

  export type RefreshSessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<RefreshSessionCreateWithoutUserInput, RefreshSessionUncheckedCreateWithoutUserInput> | RefreshSessionCreateWithoutUserInput[] | RefreshSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshSessionCreateOrConnectWithoutUserInput | RefreshSessionCreateOrConnectWithoutUserInput[]
    upsert?: RefreshSessionUpsertWithWhereUniqueWithoutUserInput | RefreshSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RefreshSessionCreateManyUserInputEnvelope
    set?: RefreshSessionWhereUniqueInput | RefreshSessionWhereUniqueInput[]
    disconnect?: RefreshSessionWhereUniqueInput | RefreshSessionWhereUniqueInput[]
    delete?: RefreshSessionWhereUniqueInput | RefreshSessionWhereUniqueInput[]
    connect?: RefreshSessionWhereUniqueInput | RefreshSessionWhereUniqueInput[]
    update?: RefreshSessionUpdateWithWhereUniqueWithoutUserInput | RefreshSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RefreshSessionUpdateManyWithWhereWithoutUserInput | RefreshSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RefreshSessionScalarWhereInput | RefreshSessionScalarWhereInput[]
  }

  export type PasswordResetChallengeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PasswordResetChallengeCreateWithoutUserInput, PasswordResetChallengeUncheckedCreateWithoutUserInput> | PasswordResetChallengeCreateWithoutUserInput[] | PasswordResetChallengeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetChallengeCreateOrConnectWithoutUserInput | PasswordResetChallengeCreateOrConnectWithoutUserInput[]
    upsert?: PasswordResetChallengeUpsertWithWhereUniqueWithoutUserInput | PasswordResetChallengeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PasswordResetChallengeCreateManyUserInputEnvelope
    set?: PasswordResetChallengeWhereUniqueInput | PasswordResetChallengeWhereUniqueInput[]
    disconnect?: PasswordResetChallengeWhereUniqueInput | PasswordResetChallengeWhereUniqueInput[]
    delete?: PasswordResetChallengeWhereUniqueInput | PasswordResetChallengeWhereUniqueInput[]
    connect?: PasswordResetChallengeWhereUniqueInput | PasswordResetChallengeWhereUniqueInput[]
    update?: PasswordResetChallengeUpdateWithWhereUniqueWithoutUserInput | PasswordResetChallengeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PasswordResetChallengeUpdateManyWithWhereWithoutUserInput | PasswordResetChallengeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PasswordResetChallengeScalarWhereInput | PasswordResetChallengeScalarWhereInput[]
  }

  export type PendingRegistrationUncheckedUpdateOneWithoutExistingUserNestedInput = {
    create?: XOR<PendingRegistrationCreateWithoutExistingUserInput, PendingRegistrationUncheckedCreateWithoutExistingUserInput>
    connectOrCreate?: PendingRegistrationCreateOrConnectWithoutExistingUserInput
    upsert?: PendingRegistrationUpsertWithoutExistingUserInput
    disconnect?: PendingRegistrationWhereInput | boolean
    delete?: PendingRegistrationWhereInput | boolean
    connect?: PendingRegistrationWhereUniqueInput
    update?: XOR<XOR<PendingRegistrationUpdateToOneWithWhereWithoutExistingUserInput, PendingRegistrationUpdateWithoutExistingUserInput>, PendingRegistrationUncheckedUpdateWithoutExistingUserInput>
  }

  export type RefreshSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<RefreshSessionCreateWithoutUserInput, RefreshSessionUncheckedCreateWithoutUserInput> | RefreshSessionCreateWithoutUserInput[] | RefreshSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshSessionCreateOrConnectWithoutUserInput | RefreshSessionCreateOrConnectWithoutUserInput[]
    upsert?: RefreshSessionUpsertWithWhereUniqueWithoutUserInput | RefreshSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RefreshSessionCreateManyUserInputEnvelope
    set?: RefreshSessionWhereUniqueInput | RefreshSessionWhereUniqueInput[]
    disconnect?: RefreshSessionWhereUniqueInput | RefreshSessionWhereUniqueInput[]
    delete?: RefreshSessionWhereUniqueInput | RefreshSessionWhereUniqueInput[]
    connect?: RefreshSessionWhereUniqueInput | RefreshSessionWhereUniqueInput[]
    update?: RefreshSessionUpdateWithWhereUniqueWithoutUserInput | RefreshSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RefreshSessionUpdateManyWithWhereWithoutUserInput | RefreshSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RefreshSessionScalarWhereInput | RefreshSessionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutPendingVerificationInput = {
    create?: XOR<UserCreateWithoutPendingVerificationInput, UserUncheckedCreateWithoutPendingVerificationInput>
    connectOrCreate?: UserCreateOrConnectWithoutPendingVerificationInput
    connect?: UserWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneWithoutPendingVerificationNestedInput = {
    create?: XOR<UserCreateWithoutPendingVerificationInput, UserUncheckedCreateWithoutPendingVerificationInput>
    connectOrCreate?: UserCreateOrConnectWithoutPendingVerificationInput
    upsert?: UserUpsertWithoutPendingVerificationInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPendingVerificationInput, UserUpdateWithoutPendingVerificationInput>, UserUncheckedUpdateWithoutPendingVerificationInput>
  }

  export type UserCreateNestedOneWithoutPasswordResetsInput = {
    create?: XOR<UserCreateWithoutPasswordResetsInput, UserUncheckedCreateWithoutPasswordResetsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPasswordResetsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPasswordResetsNestedInput = {
    create?: XOR<UserCreateWithoutPasswordResetsInput, UserUncheckedCreateWithoutPasswordResetsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPasswordResetsInput
    upsert?: UserUpsertWithoutPasswordResetsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPasswordResetsInput, UserUpdateWithoutPasswordResetsInput>, UserUncheckedUpdateWithoutPasswordResetsInput>
  }

  export type UserCreateNestedOneWithoutRefreshSessionsInput = {
    create?: XOR<UserCreateWithoutRefreshSessionsInput, UserUncheckedCreateWithoutRefreshSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutRefreshSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutRefreshSessionsNestedInput = {
    create?: XOR<UserCreateWithoutRefreshSessionsInput, UserUncheckedCreateWithoutRefreshSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutRefreshSessionsInput
    upsert?: UserUpsertWithoutRefreshSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRefreshSessionsInput, UserUpdateWithoutRefreshSessionsInput>, UserUncheckedUpdateWithoutRefreshSessionsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type PasswordResetChallengeCreateWithoutUserInput = {
    id?: string
    codeHash: string
    expiresAt: Date | string
    attempts?: number
    consumedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PasswordResetChallengeUncheckedCreateWithoutUserInput = {
    id?: string
    codeHash: string
    expiresAt: Date | string
    attempts?: number
    consumedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PasswordResetChallengeCreateOrConnectWithoutUserInput = {
    where: PasswordResetChallengeWhereUniqueInput
    create: XOR<PasswordResetChallengeCreateWithoutUserInput, PasswordResetChallengeUncheckedCreateWithoutUserInput>
  }

  export type PasswordResetChallengeCreateManyUserInputEnvelope = {
    data: PasswordResetChallengeCreateManyUserInput | PasswordResetChallengeCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PendingRegistrationCreateWithoutExistingUserInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    phone?: string | null
    country?: string | null
    countryCode?: string | null
    gender?: string | null
    otpHash: string
    otpExpiresAt: Date | string
    otpAttempts?: number
    lastOtpSentAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PendingRegistrationUncheckedCreateWithoutExistingUserInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    phone?: string | null
    country?: string | null
    countryCode?: string | null
    gender?: string | null
    otpHash: string
    otpExpiresAt: Date | string
    otpAttempts?: number
    lastOtpSentAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PendingRegistrationCreateOrConnectWithoutExistingUserInput = {
    where: PendingRegistrationWhereUniqueInput
    create: XOR<PendingRegistrationCreateWithoutExistingUserInput, PendingRegistrationUncheckedCreateWithoutExistingUserInput>
  }

  export type RefreshSessionCreateWithoutUserInput = {
    id?: string
    tokenHash: string
    expiresAt: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type RefreshSessionUncheckedCreateWithoutUserInput = {
    id?: string
    tokenHash: string
    expiresAt: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type RefreshSessionCreateOrConnectWithoutUserInput = {
    where: RefreshSessionWhereUniqueInput
    create: XOR<RefreshSessionCreateWithoutUserInput, RefreshSessionUncheckedCreateWithoutUserInput>
  }

  export type RefreshSessionCreateManyUserInputEnvelope = {
    data: RefreshSessionCreateManyUserInput | RefreshSessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PasswordResetChallengeUpsertWithWhereUniqueWithoutUserInput = {
    where: PasswordResetChallengeWhereUniqueInput
    update: XOR<PasswordResetChallengeUpdateWithoutUserInput, PasswordResetChallengeUncheckedUpdateWithoutUserInput>
    create: XOR<PasswordResetChallengeCreateWithoutUserInput, PasswordResetChallengeUncheckedCreateWithoutUserInput>
  }

  export type PasswordResetChallengeUpdateWithWhereUniqueWithoutUserInput = {
    where: PasswordResetChallengeWhereUniqueInput
    data: XOR<PasswordResetChallengeUpdateWithoutUserInput, PasswordResetChallengeUncheckedUpdateWithoutUserInput>
  }

  export type PasswordResetChallengeUpdateManyWithWhereWithoutUserInput = {
    where: PasswordResetChallengeScalarWhereInput
    data: XOR<PasswordResetChallengeUpdateManyMutationInput, PasswordResetChallengeUncheckedUpdateManyWithoutUserInput>
  }

  export type PasswordResetChallengeScalarWhereInput = {
    AND?: PasswordResetChallengeScalarWhereInput | PasswordResetChallengeScalarWhereInput[]
    OR?: PasswordResetChallengeScalarWhereInput[]
    NOT?: PasswordResetChallengeScalarWhereInput | PasswordResetChallengeScalarWhereInput[]
    id?: StringFilter<"PasswordResetChallenge"> | string
    userId?: StringFilter<"PasswordResetChallenge"> | string
    codeHash?: StringFilter<"PasswordResetChallenge"> | string
    expiresAt?: DateTimeFilter<"PasswordResetChallenge"> | Date | string
    attempts?: IntFilter<"PasswordResetChallenge"> | number
    consumedAt?: DateTimeNullableFilter<"PasswordResetChallenge"> | Date | string | null
    createdAt?: DateTimeFilter<"PasswordResetChallenge"> | Date | string
  }

  export type PendingRegistrationUpsertWithoutExistingUserInput = {
    update: XOR<PendingRegistrationUpdateWithoutExistingUserInput, PendingRegistrationUncheckedUpdateWithoutExistingUserInput>
    create: XOR<PendingRegistrationCreateWithoutExistingUserInput, PendingRegistrationUncheckedCreateWithoutExistingUserInput>
    where?: PendingRegistrationWhereInput
  }

  export type PendingRegistrationUpdateToOneWithWhereWithoutExistingUserInput = {
    where?: PendingRegistrationWhereInput
    data: XOR<PendingRegistrationUpdateWithoutExistingUserInput, PendingRegistrationUncheckedUpdateWithoutExistingUserInput>
  }

  export type PendingRegistrationUpdateWithoutExistingUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    otpHash?: StringFieldUpdateOperationsInput | string
    otpExpiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    otpAttempts?: IntFieldUpdateOperationsInput | number
    lastOtpSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PendingRegistrationUncheckedUpdateWithoutExistingUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    otpHash?: StringFieldUpdateOperationsInput | string
    otpExpiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    otpAttempts?: IntFieldUpdateOperationsInput | number
    lastOtpSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: RefreshSessionWhereUniqueInput
    update: XOR<RefreshSessionUpdateWithoutUserInput, RefreshSessionUncheckedUpdateWithoutUserInput>
    create: XOR<RefreshSessionCreateWithoutUserInput, RefreshSessionUncheckedCreateWithoutUserInput>
  }

  export type RefreshSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: RefreshSessionWhereUniqueInput
    data: XOR<RefreshSessionUpdateWithoutUserInput, RefreshSessionUncheckedUpdateWithoutUserInput>
  }

  export type RefreshSessionUpdateManyWithWhereWithoutUserInput = {
    where: RefreshSessionScalarWhereInput
    data: XOR<RefreshSessionUpdateManyMutationInput, RefreshSessionUncheckedUpdateManyWithoutUserInput>
  }

  export type RefreshSessionScalarWhereInput = {
    AND?: RefreshSessionScalarWhereInput | RefreshSessionScalarWhereInput[]
    OR?: RefreshSessionScalarWhereInput[]
    NOT?: RefreshSessionScalarWhereInput | RefreshSessionScalarWhereInput[]
    id?: StringFilter<"RefreshSession"> | string
    userId?: StringFilter<"RefreshSession"> | string
    tokenHash?: StringFilter<"RefreshSession"> | string
    expiresAt?: DateTimeFilter<"RefreshSession"> | Date | string
    revokedAt?: DateTimeNullableFilter<"RefreshSession"> | Date | string | null
    createdAt?: DateTimeFilter<"RefreshSession"> | Date | string
  }

  export type UserCreateWithoutPendingVerificationInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    username?: string | null
    displayName?: string | null
    phone?: string | null
    country?: string | null
    countryCode?: string | null
    gender?: string | null
    dateOfBirth?: Date | string | null
    bio?: string | null
    address?: string | null
    profileImageUrl?: string | null
    isEmailVerified?: boolean
    isProfileComplete?: boolean
    isVerified?: boolean
    isActive?: boolean
    role?: $Enums.UserRole
    transactionPinHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordResets?: PasswordResetChallengeCreateNestedManyWithoutUserInput
    refreshSessions?: RefreshSessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPendingVerificationInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    username?: string | null
    displayName?: string | null
    phone?: string | null
    country?: string | null
    countryCode?: string | null
    gender?: string | null
    dateOfBirth?: Date | string | null
    bio?: string | null
    address?: string | null
    profileImageUrl?: string | null
    isEmailVerified?: boolean
    isProfileComplete?: boolean
    isVerified?: boolean
    isActive?: boolean
    role?: $Enums.UserRole
    transactionPinHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordResets?: PasswordResetChallengeUncheckedCreateNestedManyWithoutUserInput
    refreshSessions?: RefreshSessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPendingVerificationInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPendingVerificationInput, UserUncheckedCreateWithoutPendingVerificationInput>
  }

  export type UserUpsertWithoutPendingVerificationInput = {
    update: XOR<UserUpdateWithoutPendingVerificationInput, UserUncheckedUpdateWithoutPendingVerificationInput>
    create: XOR<UserCreateWithoutPendingVerificationInput, UserUncheckedCreateWithoutPendingVerificationInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPendingVerificationInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPendingVerificationInput, UserUncheckedUpdateWithoutPendingVerificationInput>
  }

  export type UserUpdateWithoutPendingVerificationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    isProfileComplete?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    transactionPinHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordResets?: PasswordResetChallengeUpdateManyWithoutUserNestedInput
    refreshSessions?: RefreshSessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPendingVerificationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    isProfileComplete?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    transactionPinHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordResets?: PasswordResetChallengeUncheckedUpdateManyWithoutUserNestedInput
    refreshSessions?: RefreshSessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutPasswordResetsInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    username?: string | null
    displayName?: string | null
    phone?: string | null
    country?: string | null
    countryCode?: string | null
    gender?: string | null
    dateOfBirth?: Date | string | null
    bio?: string | null
    address?: string | null
    profileImageUrl?: string | null
    isEmailVerified?: boolean
    isProfileComplete?: boolean
    isVerified?: boolean
    isActive?: boolean
    role?: $Enums.UserRole
    transactionPinHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pendingVerification?: PendingRegistrationCreateNestedOneWithoutExistingUserInput
    refreshSessions?: RefreshSessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPasswordResetsInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    username?: string | null
    displayName?: string | null
    phone?: string | null
    country?: string | null
    countryCode?: string | null
    gender?: string | null
    dateOfBirth?: Date | string | null
    bio?: string | null
    address?: string | null
    profileImageUrl?: string | null
    isEmailVerified?: boolean
    isProfileComplete?: boolean
    isVerified?: boolean
    isActive?: boolean
    role?: $Enums.UserRole
    transactionPinHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pendingVerification?: PendingRegistrationUncheckedCreateNestedOneWithoutExistingUserInput
    refreshSessions?: RefreshSessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPasswordResetsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPasswordResetsInput, UserUncheckedCreateWithoutPasswordResetsInput>
  }

  export type UserUpsertWithoutPasswordResetsInput = {
    update: XOR<UserUpdateWithoutPasswordResetsInput, UserUncheckedUpdateWithoutPasswordResetsInput>
    create: XOR<UserCreateWithoutPasswordResetsInput, UserUncheckedCreateWithoutPasswordResetsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPasswordResetsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPasswordResetsInput, UserUncheckedUpdateWithoutPasswordResetsInput>
  }

  export type UserUpdateWithoutPasswordResetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    isProfileComplete?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    transactionPinHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pendingVerification?: PendingRegistrationUpdateOneWithoutExistingUserNestedInput
    refreshSessions?: RefreshSessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPasswordResetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    isProfileComplete?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    transactionPinHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pendingVerification?: PendingRegistrationUncheckedUpdateOneWithoutExistingUserNestedInput
    refreshSessions?: RefreshSessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutRefreshSessionsInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    username?: string | null
    displayName?: string | null
    phone?: string | null
    country?: string | null
    countryCode?: string | null
    gender?: string | null
    dateOfBirth?: Date | string | null
    bio?: string | null
    address?: string | null
    profileImageUrl?: string | null
    isEmailVerified?: boolean
    isProfileComplete?: boolean
    isVerified?: boolean
    isActive?: boolean
    role?: $Enums.UserRole
    transactionPinHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordResets?: PasswordResetChallengeCreateNestedManyWithoutUserInput
    pendingVerification?: PendingRegistrationCreateNestedOneWithoutExistingUserInput
  }

  export type UserUncheckedCreateWithoutRefreshSessionsInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    username?: string | null
    displayName?: string | null
    phone?: string | null
    country?: string | null
    countryCode?: string | null
    gender?: string | null
    dateOfBirth?: Date | string | null
    bio?: string | null
    address?: string | null
    profileImageUrl?: string | null
    isEmailVerified?: boolean
    isProfileComplete?: boolean
    isVerified?: boolean
    isActive?: boolean
    role?: $Enums.UserRole
    transactionPinHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordResets?: PasswordResetChallengeUncheckedCreateNestedManyWithoutUserInput
    pendingVerification?: PendingRegistrationUncheckedCreateNestedOneWithoutExistingUserInput
  }

  export type UserCreateOrConnectWithoutRefreshSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRefreshSessionsInput, UserUncheckedCreateWithoutRefreshSessionsInput>
  }

  export type UserUpsertWithoutRefreshSessionsInput = {
    update: XOR<UserUpdateWithoutRefreshSessionsInput, UserUncheckedUpdateWithoutRefreshSessionsInput>
    create: XOR<UserCreateWithoutRefreshSessionsInput, UserUncheckedCreateWithoutRefreshSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRefreshSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRefreshSessionsInput, UserUncheckedUpdateWithoutRefreshSessionsInput>
  }

  export type UserUpdateWithoutRefreshSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    isProfileComplete?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    transactionPinHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordResets?: PasswordResetChallengeUpdateManyWithoutUserNestedInput
    pendingVerification?: PendingRegistrationUpdateOneWithoutExistingUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRefreshSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    isProfileComplete?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    transactionPinHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordResets?: PasswordResetChallengeUncheckedUpdateManyWithoutUserNestedInput
    pendingVerification?: PendingRegistrationUncheckedUpdateOneWithoutExistingUserNestedInput
  }

  export type PasswordResetChallengeCreateManyUserInput = {
    id?: string
    codeHash: string
    expiresAt: Date | string
    attempts?: number
    consumedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type RefreshSessionCreateManyUserInput = {
    id?: string
    tokenHash: string
    expiresAt: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PasswordResetChallengeUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attempts?: IntFieldUpdateOperationsInput | number
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetChallengeUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attempts?: IntFieldUpdateOperationsInput | number
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetChallengeUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attempts?: IntFieldUpdateOperationsInput | number
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshSessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshSessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshSessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}