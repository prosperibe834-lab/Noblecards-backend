
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
 * Model Wallet
 * 
 */
export type Wallet = $Result.DefaultSelection<Prisma.$WalletPayload>
/**
 * Model Currency
 * 
 */
export type Currency = $Result.DefaultSelection<Prisma.$CurrencyPayload>
/**
 * Model WalletBalance
 * 
 */
export type WalletBalance = $Result.DefaultSelection<Prisma.$WalletBalancePayload>
/**
 * Model Deposit
 * 
 */
export type Deposit = $Result.DefaultSelection<Prisma.$DepositPayload>
/**
 * Model Transaction
 * 
 */
export type Transaction = $Result.DefaultSelection<Prisma.$TransactionPayload>
/**
 * Model LedgerEntry
 * 
 */
export type LedgerEntry = $Result.DefaultSelection<Prisma.$LedgerEntryPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const DepositStatus: {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SUCCESSFUL: 'SUCCESSFUL',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
  REVERSED: 'REVERSED',
  EXPIRED: 'EXPIRED',
  UNDER_REVIEW: 'UNDER_REVIEW'
};

export type DepositStatus = (typeof DepositStatus)[keyof typeof DepositStatus]


export const TransactionStatus: {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SUCCESSFUL: 'SUCCESSFUL',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
  REVERSED: 'REVERSED',
  EXPIRED: 'EXPIRED',
  UNDER_REVIEW: 'UNDER_REVIEW'
};

export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus]


export const TransactionType: {
  DEPOSIT: 'DEPOSIT',
  WITHDRAWAL: 'WITHDRAWAL',
  TRANSFER: 'TRANSFER',
  FEE: 'FEE',
  REFUND: 'REFUND',
  REVERSAL: 'REVERSAL',
  PURCHASE: 'PURCHASE',
  BONUS: 'BONUS',
  ADJUSTMENT: 'ADJUSTMENT'
};

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType]


export const PaymentProvider: {
  FLUTTERWAVE: 'FLUTTERWAVE',
  MANUAL: 'MANUAL',
  INTERNAL: 'INTERNAL'
};

export type PaymentProvider = (typeof PaymentProvider)[keyof typeof PaymentProvider]


export const PaymentMethod: {
  BANK_TRANSFER: 'BANK_TRANSFER',
  CARD: 'CARD',
  USSD: 'USSD',
  MOBILE_MONEY: 'MOBILE_MONEY',
  WALLET_TRANSFER: 'WALLET_TRANSFER',
  APPLE_PAY: 'APPLE_PAY',
  GOOGLE_PAY: 'GOOGLE_PAY',
  WISE: 'WISE',
  OTHER: 'OTHER'
};

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod]


export const LedgerEntryType: {
  CREDIT: 'CREDIT',
  DEBIT: 'DEBIT',
  HOLD: 'HOLD',
  RELEASE: 'RELEASE',
  FEE: 'FEE',
  REFUND: 'REFUND',
  REVERSAL: 'REVERSAL',
  ADJUSTMENT: 'ADJUSTMENT'
};

export type LedgerEntryType = (typeof LedgerEntryType)[keyof typeof LedgerEntryType]


export const UserRole: {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

}

export type DepositStatus = $Enums.DepositStatus

export const DepositStatus: typeof $Enums.DepositStatus

export type TransactionStatus = $Enums.TransactionStatus

export const TransactionStatus: typeof $Enums.TransactionStatus

export type TransactionType = $Enums.TransactionType

export const TransactionType: typeof $Enums.TransactionType

export type PaymentProvider = $Enums.PaymentProvider

export const PaymentProvider: typeof $Enums.PaymentProvider

export type PaymentMethod = $Enums.PaymentMethod

export const PaymentMethod: typeof $Enums.PaymentMethod

export type LedgerEntryType = $Enums.LedgerEntryType

export const LedgerEntryType: typeof $Enums.LedgerEntryType

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

  /**
   * `prisma.wallet`: Exposes CRUD operations for the **Wallet** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Wallets
    * const wallets = await prisma.wallet.findMany()
    * ```
    */
  get wallet(): Prisma.WalletDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.currency`: Exposes CRUD operations for the **Currency** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Currencies
    * const currencies = await prisma.currency.findMany()
    * ```
    */
  get currency(): Prisma.CurrencyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.walletBalance`: Exposes CRUD operations for the **WalletBalance** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WalletBalances
    * const walletBalances = await prisma.walletBalance.findMany()
    * ```
    */
  get walletBalance(): Prisma.WalletBalanceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.deposit`: Exposes CRUD operations for the **Deposit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Deposits
    * const deposits = await prisma.deposit.findMany()
    * ```
    */
  get deposit(): Prisma.DepositDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transaction`: Exposes CRUD operations for the **Transaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transactions
    * const transactions = await prisma.transaction.findMany()
    * ```
    */
  get transaction(): Prisma.TransactionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ledgerEntry`: Exposes CRUD operations for the **LedgerEntry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LedgerEntries
    * const ledgerEntries = await prisma.ledgerEntry.findMany()
    * ```
    */
  get ledgerEntry(): Prisma.LedgerEntryDelegate<ExtArgs, ClientOptions>;
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
    RefreshSession: 'RefreshSession',
    Wallet: 'Wallet',
    Currency: 'Currency',
    WalletBalance: 'WalletBalance',
    Deposit: 'Deposit',
    Transaction: 'Transaction',
    LedgerEntry: 'LedgerEntry'
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
      modelProps: "user" | "pendingRegistration" | "passwordResetChallenge" | "refreshSession" | "wallet" | "currency" | "walletBalance" | "deposit" | "transaction" | "ledgerEntry"
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
      Wallet: {
        payload: Prisma.$WalletPayload<ExtArgs>
        fields: Prisma.WalletFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WalletFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WalletFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          findFirst: {
            args: Prisma.WalletFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WalletFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          findMany: {
            args: Prisma.WalletFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>[]
          }
          create: {
            args: Prisma.WalletCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          createMany: {
            args: Prisma.WalletCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WalletCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>[]
          }
          delete: {
            args: Prisma.WalletDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          update: {
            args: Prisma.WalletUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          deleteMany: {
            args: Prisma.WalletDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WalletUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WalletUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>[]
          }
          upsert: {
            args: Prisma.WalletUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          aggregate: {
            args: Prisma.WalletAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWallet>
          }
          groupBy: {
            args: Prisma.WalletGroupByArgs<ExtArgs>
            result: $Utils.Optional<WalletGroupByOutputType>[]
          }
          count: {
            args: Prisma.WalletCountArgs<ExtArgs>
            result: $Utils.Optional<WalletCountAggregateOutputType> | number
          }
        }
      }
      Currency: {
        payload: Prisma.$CurrencyPayload<ExtArgs>
        fields: Prisma.CurrencyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CurrencyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CurrencyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CurrencyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CurrencyPayload>
          }
          findFirst: {
            args: Prisma.CurrencyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CurrencyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CurrencyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CurrencyPayload>
          }
          findMany: {
            args: Prisma.CurrencyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CurrencyPayload>[]
          }
          create: {
            args: Prisma.CurrencyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CurrencyPayload>
          }
          createMany: {
            args: Prisma.CurrencyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CurrencyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CurrencyPayload>[]
          }
          delete: {
            args: Prisma.CurrencyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CurrencyPayload>
          }
          update: {
            args: Prisma.CurrencyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CurrencyPayload>
          }
          deleteMany: {
            args: Prisma.CurrencyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CurrencyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CurrencyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CurrencyPayload>[]
          }
          upsert: {
            args: Prisma.CurrencyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CurrencyPayload>
          }
          aggregate: {
            args: Prisma.CurrencyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCurrency>
          }
          groupBy: {
            args: Prisma.CurrencyGroupByArgs<ExtArgs>
            result: $Utils.Optional<CurrencyGroupByOutputType>[]
          }
          count: {
            args: Prisma.CurrencyCountArgs<ExtArgs>
            result: $Utils.Optional<CurrencyCountAggregateOutputType> | number
          }
        }
      }
      WalletBalance: {
        payload: Prisma.$WalletBalancePayload<ExtArgs>
        fields: Prisma.WalletBalanceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WalletBalanceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletBalancePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WalletBalanceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletBalancePayload>
          }
          findFirst: {
            args: Prisma.WalletBalanceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletBalancePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WalletBalanceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletBalancePayload>
          }
          findMany: {
            args: Prisma.WalletBalanceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletBalancePayload>[]
          }
          create: {
            args: Prisma.WalletBalanceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletBalancePayload>
          }
          createMany: {
            args: Prisma.WalletBalanceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WalletBalanceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletBalancePayload>[]
          }
          delete: {
            args: Prisma.WalletBalanceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletBalancePayload>
          }
          update: {
            args: Prisma.WalletBalanceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletBalancePayload>
          }
          deleteMany: {
            args: Prisma.WalletBalanceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WalletBalanceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WalletBalanceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletBalancePayload>[]
          }
          upsert: {
            args: Prisma.WalletBalanceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletBalancePayload>
          }
          aggregate: {
            args: Prisma.WalletBalanceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWalletBalance>
          }
          groupBy: {
            args: Prisma.WalletBalanceGroupByArgs<ExtArgs>
            result: $Utils.Optional<WalletBalanceGroupByOutputType>[]
          }
          count: {
            args: Prisma.WalletBalanceCountArgs<ExtArgs>
            result: $Utils.Optional<WalletBalanceCountAggregateOutputType> | number
          }
        }
      }
      Deposit: {
        payload: Prisma.$DepositPayload<ExtArgs>
        fields: Prisma.DepositFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DepositFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DepositFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositPayload>
          }
          findFirst: {
            args: Prisma.DepositFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DepositFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositPayload>
          }
          findMany: {
            args: Prisma.DepositFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositPayload>[]
          }
          create: {
            args: Prisma.DepositCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositPayload>
          }
          createMany: {
            args: Prisma.DepositCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DepositCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositPayload>[]
          }
          delete: {
            args: Prisma.DepositDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositPayload>
          }
          update: {
            args: Prisma.DepositUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositPayload>
          }
          deleteMany: {
            args: Prisma.DepositDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DepositUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DepositUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositPayload>[]
          }
          upsert: {
            args: Prisma.DepositUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositPayload>
          }
          aggregate: {
            args: Prisma.DepositAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDeposit>
          }
          groupBy: {
            args: Prisma.DepositGroupByArgs<ExtArgs>
            result: $Utils.Optional<DepositGroupByOutputType>[]
          }
          count: {
            args: Prisma.DepositCountArgs<ExtArgs>
            result: $Utils.Optional<DepositCountAggregateOutputType> | number
          }
        }
      }
      Transaction: {
        payload: Prisma.$TransactionPayload<ExtArgs>
        fields: Prisma.TransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findFirst: {
            args: Prisma.TransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findMany: {
            args: Prisma.TransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          create: {
            args: Prisma.TransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          createMany: {
            args: Prisma.TransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TransactionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          delete: {
            args: Prisma.TransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          update: {
            args: Prisma.TransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          deleteMany: {
            args: Prisma.TransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TransactionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          upsert: {
            args: Prisma.TransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          aggregate: {
            args: Prisma.TransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransaction>
          }
          groupBy: {
            args: Prisma.TransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransactionCountArgs<ExtArgs>
            result: $Utils.Optional<TransactionCountAggregateOutputType> | number
          }
        }
      }
      LedgerEntry: {
        payload: Prisma.$LedgerEntryPayload<ExtArgs>
        fields: Prisma.LedgerEntryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LedgerEntryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LedgerEntryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>
          }
          findFirst: {
            args: Prisma.LedgerEntryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LedgerEntryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>
          }
          findMany: {
            args: Prisma.LedgerEntryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>[]
          }
          create: {
            args: Prisma.LedgerEntryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>
          }
          createMany: {
            args: Prisma.LedgerEntryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LedgerEntryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>[]
          }
          delete: {
            args: Prisma.LedgerEntryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>
          }
          update: {
            args: Prisma.LedgerEntryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>
          }
          deleteMany: {
            args: Prisma.LedgerEntryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LedgerEntryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LedgerEntryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>[]
          }
          upsert: {
            args: Prisma.LedgerEntryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>
          }
          aggregate: {
            args: Prisma.LedgerEntryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLedgerEntry>
          }
          groupBy: {
            args: Prisma.LedgerEntryGroupByArgs<ExtArgs>
            result: $Utils.Optional<LedgerEntryGroupByOutputType>[]
          }
          count: {
            args: Prisma.LedgerEntryCountArgs<ExtArgs>
            result: $Utils.Optional<LedgerEntryCountAggregateOutputType> | number
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
    wallet?: WalletOmit
    currency?: CurrencyOmit
    walletBalance?: WalletBalanceOmit
    deposit?: DepositOmit
    transaction?: TransactionOmit
    ledgerEntry?: LedgerEntryOmit
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
    deposits: number
    transactions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    passwordResets?: boolean | UserCountOutputTypeCountPasswordResetsArgs
    refreshSessions?: boolean | UserCountOutputTypeCountRefreshSessionsArgs
    deposits?: boolean | UserCountOutputTypeCountDepositsArgs
    transactions?: boolean | UserCountOutputTypeCountTransactionsArgs
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
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountDepositsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepositWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }


  /**
   * Count Type WalletCountOutputType
   */

  export type WalletCountOutputType = {
    balances: number
    deposits: number
    transactions: number
    ledgerEntries: number
  }

  export type WalletCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    balances?: boolean | WalletCountOutputTypeCountBalancesArgs
    deposits?: boolean | WalletCountOutputTypeCountDepositsArgs
    transactions?: boolean | WalletCountOutputTypeCountTransactionsArgs
    ledgerEntries?: boolean | WalletCountOutputTypeCountLedgerEntriesArgs
  }

  // Custom InputTypes
  /**
   * WalletCountOutputType without action
   */
  export type WalletCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletCountOutputType
     */
    select?: WalletCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WalletCountOutputType without action
   */
  export type WalletCountOutputTypeCountBalancesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WalletBalanceWhereInput
  }

  /**
   * WalletCountOutputType without action
   */
  export type WalletCountOutputTypeCountDepositsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepositWhereInput
  }

  /**
   * WalletCountOutputType without action
   */
  export type WalletCountOutputTypeCountTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }

  /**
   * WalletCountOutputType without action
   */
  export type WalletCountOutputTypeCountLedgerEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LedgerEntryWhereInput
  }


  /**
   * Count Type CurrencyCountOutputType
   */

  export type CurrencyCountOutputType = {
    balances: number
    deposits: number
    transactions: number
    ledgerEntries: number
  }

  export type CurrencyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    balances?: boolean | CurrencyCountOutputTypeCountBalancesArgs
    deposits?: boolean | CurrencyCountOutputTypeCountDepositsArgs
    transactions?: boolean | CurrencyCountOutputTypeCountTransactionsArgs
    ledgerEntries?: boolean | CurrencyCountOutputTypeCountLedgerEntriesArgs
  }

  // Custom InputTypes
  /**
   * CurrencyCountOutputType without action
   */
  export type CurrencyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CurrencyCountOutputType
     */
    select?: CurrencyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CurrencyCountOutputType without action
   */
  export type CurrencyCountOutputTypeCountBalancesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WalletBalanceWhereInput
  }

  /**
   * CurrencyCountOutputType without action
   */
  export type CurrencyCountOutputTypeCountDepositsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepositWhereInput
  }

  /**
   * CurrencyCountOutputType without action
   */
  export type CurrencyCountOutputTypeCountTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }

  /**
   * CurrencyCountOutputType without action
   */
  export type CurrencyCountOutputTypeCountLedgerEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LedgerEntryWhereInput
  }


  /**
   * Count Type TransactionCountOutputType
   */

  export type TransactionCountOutputType = {
    ledgerEntries: number
  }

  export type TransactionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ledgerEntries?: boolean | TransactionCountOutputTypeCountLedgerEntriesArgs
  }

  // Custom InputTypes
  /**
   * TransactionCountOutputType without action
   */
  export type TransactionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionCountOutputType
     */
    select?: TransactionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TransactionCountOutputType without action
   */
  export type TransactionCountOutputTypeCountLedgerEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LedgerEntryWhereInput
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
    wallet?: boolean | User$walletArgs<ExtArgs>
    deposits?: boolean | User$depositsArgs<ExtArgs>
    transactions?: boolean | User$transactionsArgs<ExtArgs>
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
    wallet?: boolean | User$walletArgs<ExtArgs>
    deposits?: boolean | User$depositsArgs<ExtArgs>
    transactions?: boolean | User$transactionsArgs<ExtArgs>
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
      wallet: Prisma.$WalletPayload<ExtArgs> | null
      deposits: Prisma.$DepositPayload<ExtArgs>[]
      transactions: Prisma.$TransactionPayload<ExtArgs>[]
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
    wallet<T extends User$walletArgs<ExtArgs> = {}>(args?: Subset<T, User$walletArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    deposits<T extends User$depositsArgs<ExtArgs> = {}>(args?: Subset<T, User$depositsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transactions<T extends User$transactionsArgs<ExtArgs> = {}>(args?: Subset<T, User$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * User.wallet
   */
  export type User$walletArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    where?: WalletWhereInput
  }

  /**
   * User.deposits
   */
  export type User$depositsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposit
     */
    select?: DepositSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deposit
     */
    omit?: DepositOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositInclude<ExtArgs> | null
    where?: DepositWhereInput
    orderBy?: DepositOrderByWithRelationInput | DepositOrderByWithRelationInput[]
    cursor?: DepositWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DepositScalarFieldEnum | DepositScalarFieldEnum[]
  }

  /**
   * User.transactions
   */
  export type User$transactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
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
   * Model Wallet
   */

  export type AggregateWallet = {
    _count: WalletCountAggregateOutputType | null
    _min: WalletMinAggregateOutputType | null
    _max: WalletMaxAggregateOutputType | null
  }

  export type WalletMinAggregateOutputType = {
    id: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WalletMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WalletCountAggregateOutputType = {
    id: number
    userId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WalletMinAggregateInputType = {
    id?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WalletMaxAggregateInputType = {
    id?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WalletCountAggregateInputType = {
    id?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WalletAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Wallet to aggregate.
     */
    where?: WalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wallets to fetch.
     */
    orderBy?: WalletOrderByWithRelationInput | WalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Wallets
    **/
    _count?: true | WalletCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WalletMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WalletMaxAggregateInputType
  }

  export type GetWalletAggregateType<T extends WalletAggregateArgs> = {
        [P in keyof T & keyof AggregateWallet]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWallet[P]>
      : GetScalarType<T[P], AggregateWallet[P]>
  }




  export type WalletGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WalletWhereInput
    orderBy?: WalletOrderByWithAggregationInput | WalletOrderByWithAggregationInput[]
    by: WalletScalarFieldEnum[] | WalletScalarFieldEnum
    having?: WalletScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WalletCountAggregateInputType | true
    _min?: WalletMinAggregateInputType
    _max?: WalletMaxAggregateInputType
  }

  export type WalletGroupByOutputType = {
    id: string
    userId: string
    createdAt: Date
    updatedAt: Date
    _count: WalletCountAggregateOutputType | null
    _min: WalletMinAggregateOutputType | null
    _max: WalletMaxAggregateOutputType | null
  }

  type GetWalletGroupByPayload<T extends WalletGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WalletGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WalletGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WalletGroupByOutputType[P]>
            : GetScalarType<T[P], WalletGroupByOutputType[P]>
        }
      >
    >


  export type WalletSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    balances?: boolean | Wallet$balancesArgs<ExtArgs>
    deposits?: boolean | Wallet$depositsArgs<ExtArgs>
    transactions?: boolean | Wallet$transactionsArgs<ExtArgs>
    ledgerEntries?: boolean | Wallet$ledgerEntriesArgs<ExtArgs>
    _count?: boolean | WalletCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wallet"]>

  export type WalletSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wallet"]>

  export type WalletSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wallet"]>

  export type WalletSelectScalar = {
    id?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WalletOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "createdAt" | "updatedAt", ExtArgs["result"]["wallet"]>
  export type WalletInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    balances?: boolean | Wallet$balancesArgs<ExtArgs>
    deposits?: boolean | Wallet$depositsArgs<ExtArgs>
    transactions?: boolean | Wallet$transactionsArgs<ExtArgs>
    ledgerEntries?: boolean | Wallet$ledgerEntriesArgs<ExtArgs>
    _count?: boolean | WalletCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WalletIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type WalletIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $WalletPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Wallet"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      balances: Prisma.$WalletBalancePayload<ExtArgs>[]
      deposits: Prisma.$DepositPayload<ExtArgs>[]
      transactions: Prisma.$TransactionPayload<ExtArgs>[]
      ledgerEntries: Prisma.$LedgerEntryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["wallet"]>
    composites: {}
  }

  type WalletGetPayload<S extends boolean | null | undefined | WalletDefaultArgs> = $Result.GetResult<Prisma.$WalletPayload, S>

  type WalletCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WalletFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WalletCountAggregateInputType | true
    }

  export interface WalletDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Wallet'], meta: { name: 'Wallet' } }
    /**
     * Find zero or one Wallet that matches the filter.
     * @param {WalletFindUniqueArgs} args - Arguments to find a Wallet
     * @example
     * // Get one Wallet
     * const wallet = await prisma.wallet.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WalletFindUniqueArgs>(args: SelectSubset<T, WalletFindUniqueArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Wallet that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WalletFindUniqueOrThrowArgs} args - Arguments to find a Wallet
     * @example
     * // Get one Wallet
     * const wallet = await prisma.wallet.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WalletFindUniqueOrThrowArgs>(args: SelectSubset<T, WalletFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Wallet that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletFindFirstArgs} args - Arguments to find a Wallet
     * @example
     * // Get one Wallet
     * const wallet = await prisma.wallet.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WalletFindFirstArgs>(args?: SelectSubset<T, WalletFindFirstArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Wallet that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletFindFirstOrThrowArgs} args - Arguments to find a Wallet
     * @example
     * // Get one Wallet
     * const wallet = await prisma.wallet.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WalletFindFirstOrThrowArgs>(args?: SelectSubset<T, WalletFindFirstOrThrowArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Wallets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Wallets
     * const wallets = await prisma.wallet.findMany()
     * 
     * // Get first 10 Wallets
     * const wallets = await prisma.wallet.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const walletWithIdOnly = await prisma.wallet.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WalletFindManyArgs>(args?: SelectSubset<T, WalletFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Wallet.
     * @param {WalletCreateArgs} args - Arguments to create a Wallet.
     * @example
     * // Create one Wallet
     * const Wallet = await prisma.wallet.create({
     *   data: {
     *     // ... data to create a Wallet
     *   }
     * })
     * 
     */
    create<T extends WalletCreateArgs>(args: SelectSubset<T, WalletCreateArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Wallets.
     * @param {WalletCreateManyArgs} args - Arguments to create many Wallets.
     * @example
     * // Create many Wallets
     * const wallet = await prisma.wallet.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WalletCreateManyArgs>(args?: SelectSubset<T, WalletCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Wallets and returns the data saved in the database.
     * @param {WalletCreateManyAndReturnArgs} args - Arguments to create many Wallets.
     * @example
     * // Create many Wallets
     * const wallet = await prisma.wallet.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Wallets and only return the `id`
     * const walletWithIdOnly = await prisma.wallet.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WalletCreateManyAndReturnArgs>(args?: SelectSubset<T, WalletCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Wallet.
     * @param {WalletDeleteArgs} args - Arguments to delete one Wallet.
     * @example
     * // Delete one Wallet
     * const Wallet = await prisma.wallet.delete({
     *   where: {
     *     // ... filter to delete one Wallet
     *   }
     * })
     * 
     */
    delete<T extends WalletDeleteArgs>(args: SelectSubset<T, WalletDeleteArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Wallet.
     * @param {WalletUpdateArgs} args - Arguments to update one Wallet.
     * @example
     * // Update one Wallet
     * const wallet = await prisma.wallet.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WalletUpdateArgs>(args: SelectSubset<T, WalletUpdateArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Wallets.
     * @param {WalletDeleteManyArgs} args - Arguments to filter Wallets to delete.
     * @example
     * // Delete a few Wallets
     * const { count } = await prisma.wallet.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WalletDeleteManyArgs>(args?: SelectSubset<T, WalletDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Wallets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Wallets
     * const wallet = await prisma.wallet.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WalletUpdateManyArgs>(args: SelectSubset<T, WalletUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Wallets and returns the data updated in the database.
     * @param {WalletUpdateManyAndReturnArgs} args - Arguments to update many Wallets.
     * @example
     * // Update many Wallets
     * const wallet = await prisma.wallet.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Wallets and only return the `id`
     * const walletWithIdOnly = await prisma.wallet.updateManyAndReturn({
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
    updateManyAndReturn<T extends WalletUpdateManyAndReturnArgs>(args: SelectSubset<T, WalletUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Wallet.
     * @param {WalletUpsertArgs} args - Arguments to update or create a Wallet.
     * @example
     * // Update or create a Wallet
     * const wallet = await prisma.wallet.upsert({
     *   create: {
     *     // ... data to create a Wallet
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Wallet we want to update
     *   }
     * })
     */
    upsert<T extends WalletUpsertArgs>(args: SelectSubset<T, WalletUpsertArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Wallets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletCountArgs} args - Arguments to filter Wallets to count.
     * @example
     * // Count the number of Wallets
     * const count = await prisma.wallet.count({
     *   where: {
     *     // ... the filter for the Wallets we want to count
     *   }
     * })
    **/
    count<T extends WalletCountArgs>(
      args?: Subset<T, WalletCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WalletCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Wallet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends WalletAggregateArgs>(args: Subset<T, WalletAggregateArgs>): Prisma.PrismaPromise<GetWalletAggregateType<T>>

    /**
     * Group by Wallet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletGroupByArgs} args - Group by arguments.
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
      T extends WalletGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WalletGroupByArgs['orderBy'] }
        : { orderBy?: WalletGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, WalletGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWalletGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Wallet model
   */
  readonly fields: WalletFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Wallet.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WalletClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    balances<T extends Wallet$balancesArgs<ExtArgs> = {}>(args?: Subset<T, Wallet$balancesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WalletBalancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    deposits<T extends Wallet$depositsArgs<ExtArgs> = {}>(args?: Subset<T, Wallet$depositsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transactions<T extends Wallet$transactionsArgs<ExtArgs> = {}>(args?: Subset<T, Wallet$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ledgerEntries<T extends Wallet$ledgerEntriesArgs<ExtArgs> = {}>(args?: Subset<T, Wallet$ledgerEntriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Wallet model
   */
  interface WalletFieldRefs {
    readonly id: FieldRef<"Wallet", 'String'>
    readonly userId: FieldRef<"Wallet", 'String'>
    readonly createdAt: FieldRef<"Wallet", 'DateTime'>
    readonly updatedAt: FieldRef<"Wallet", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Wallet findUnique
   */
  export type WalletFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * Filter, which Wallet to fetch.
     */
    where: WalletWhereUniqueInput
  }

  /**
   * Wallet findUniqueOrThrow
   */
  export type WalletFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * Filter, which Wallet to fetch.
     */
    where: WalletWhereUniqueInput
  }

  /**
   * Wallet findFirst
   */
  export type WalletFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * Filter, which Wallet to fetch.
     */
    where?: WalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wallets to fetch.
     */
    orderBy?: WalletOrderByWithRelationInput | WalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Wallets.
     */
    cursor?: WalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Wallets.
     */
    distinct?: WalletScalarFieldEnum | WalletScalarFieldEnum[]
  }

  /**
   * Wallet findFirstOrThrow
   */
  export type WalletFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * Filter, which Wallet to fetch.
     */
    where?: WalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wallets to fetch.
     */
    orderBy?: WalletOrderByWithRelationInput | WalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Wallets.
     */
    cursor?: WalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Wallets.
     */
    distinct?: WalletScalarFieldEnum | WalletScalarFieldEnum[]
  }

  /**
   * Wallet findMany
   */
  export type WalletFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * Filter, which Wallets to fetch.
     */
    where?: WalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wallets to fetch.
     */
    orderBy?: WalletOrderByWithRelationInput | WalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Wallets.
     */
    cursor?: WalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Wallets.
     */
    distinct?: WalletScalarFieldEnum | WalletScalarFieldEnum[]
  }

  /**
   * Wallet create
   */
  export type WalletCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * The data needed to create a Wallet.
     */
    data: XOR<WalletCreateInput, WalletUncheckedCreateInput>
  }

  /**
   * Wallet createMany
   */
  export type WalletCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Wallets.
     */
    data: WalletCreateManyInput | WalletCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Wallet createManyAndReturn
   */
  export type WalletCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * The data used to create many Wallets.
     */
    data: WalletCreateManyInput | WalletCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Wallet update
   */
  export type WalletUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * The data needed to update a Wallet.
     */
    data: XOR<WalletUpdateInput, WalletUncheckedUpdateInput>
    /**
     * Choose, which Wallet to update.
     */
    where: WalletWhereUniqueInput
  }

  /**
   * Wallet updateMany
   */
  export type WalletUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Wallets.
     */
    data: XOR<WalletUpdateManyMutationInput, WalletUncheckedUpdateManyInput>
    /**
     * Filter which Wallets to update
     */
    where?: WalletWhereInput
    /**
     * Limit how many Wallets to update.
     */
    limit?: number
  }

  /**
   * Wallet updateManyAndReturn
   */
  export type WalletUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * The data used to update Wallets.
     */
    data: XOR<WalletUpdateManyMutationInput, WalletUncheckedUpdateManyInput>
    /**
     * Filter which Wallets to update
     */
    where?: WalletWhereInput
    /**
     * Limit how many Wallets to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Wallet upsert
   */
  export type WalletUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * The filter to search for the Wallet to update in case it exists.
     */
    where: WalletWhereUniqueInput
    /**
     * In case the Wallet found by the `where` argument doesn't exist, create a new Wallet with this data.
     */
    create: XOR<WalletCreateInput, WalletUncheckedCreateInput>
    /**
     * In case the Wallet was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WalletUpdateInput, WalletUncheckedUpdateInput>
  }

  /**
   * Wallet delete
   */
  export type WalletDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * Filter which Wallet to delete.
     */
    where: WalletWhereUniqueInput
  }

  /**
   * Wallet deleteMany
   */
  export type WalletDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Wallets to delete
     */
    where?: WalletWhereInput
    /**
     * Limit how many Wallets to delete.
     */
    limit?: number
  }

  /**
   * Wallet.balances
   */
  export type Wallet$balancesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WalletBalance
     */
    omit?: WalletBalanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceInclude<ExtArgs> | null
    where?: WalletBalanceWhereInput
    orderBy?: WalletBalanceOrderByWithRelationInput | WalletBalanceOrderByWithRelationInput[]
    cursor?: WalletBalanceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WalletBalanceScalarFieldEnum | WalletBalanceScalarFieldEnum[]
  }

  /**
   * Wallet.deposits
   */
  export type Wallet$depositsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposit
     */
    select?: DepositSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deposit
     */
    omit?: DepositOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositInclude<ExtArgs> | null
    where?: DepositWhereInput
    orderBy?: DepositOrderByWithRelationInput | DepositOrderByWithRelationInput[]
    cursor?: DepositWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DepositScalarFieldEnum | DepositScalarFieldEnum[]
  }

  /**
   * Wallet.transactions
   */
  export type Wallet$transactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Wallet.ledgerEntries
   */
  export type Wallet$ledgerEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryInclude<ExtArgs> | null
    where?: LedgerEntryWhereInput
    orderBy?: LedgerEntryOrderByWithRelationInput | LedgerEntryOrderByWithRelationInput[]
    cursor?: LedgerEntryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LedgerEntryScalarFieldEnum | LedgerEntryScalarFieldEnum[]
  }

  /**
   * Wallet without action
   */
  export type WalletDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
  }


  /**
   * Model Currency
   */

  export type AggregateCurrency = {
    _count: CurrencyCountAggregateOutputType | null
    _min: CurrencyMinAggregateOutputType | null
    _max: CurrencyMaxAggregateOutputType | null
  }

  export type CurrencyMinAggregateOutputType = {
    code: string | null
    name: string | null
    symbol: string | null
    country: string | null
    region: string | null
    flag: string | null
    enabled: boolean | null
    depositEnabled: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CurrencyMaxAggregateOutputType = {
    code: string | null
    name: string | null
    symbol: string | null
    country: string | null
    region: string | null
    flag: string | null
    enabled: boolean | null
    depositEnabled: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CurrencyCountAggregateOutputType = {
    code: number
    name: number
    symbol: number
    country: number
    region: number
    flag: number
    enabled: number
    depositEnabled: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CurrencyMinAggregateInputType = {
    code?: true
    name?: true
    symbol?: true
    country?: true
    region?: true
    flag?: true
    enabled?: true
    depositEnabled?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CurrencyMaxAggregateInputType = {
    code?: true
    name?: true
    symbol?: true
    country?: true
    region?: true
    flag?: true
    enabled?: true
    depositEnabled?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CurrencyCountAggregateInputType = {
    code?: true
    name?: true
    symbol?: true
    country?: true
    region?: true
    flag?: true
    enabled?: true
    depositEnabled?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CurrencyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Currency to aggregate.
     */
    where?: CurrencyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Currencies to fetch.
     */
    orderBy?: CurrencyOrderByWithRelationInput | CurrencyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CurrencyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Currencies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Currencies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Currencies
    **/
    _count?: true | CurrencyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CurrencyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CurrencyMaxAggregateInputType
  }

  export type GetCurrencyAggregateType<T extends CurrencyAggregateArgs> = {
        [P in keyof T & keyof AggregateCurrency]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCurrency[P]>
      : GetScalarType<T[P], AggregateCurrency[P]>
  }




  export type CurrencyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CurrencyWhereInput
    orderBy?: CurrencyOrderByWithAggregationInput | CurrencyOrderByWithAggregationInput[]
    by: CurrencyScalarFieldEnum[] | CurrencyScalarFieldEnum
    having?: CurrencyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CurrencyCountAggregateInputType | true
    _min?: CurrencyMinAggregateInputType
    _max?: CurrencyMaxAggregateInputType
  }

  export type CurrencyGroupByOutputType = {
    code: string
    name: string
    symbol: string | null
    country: string | null
    region: string | null
    flag: string | null
    enabled: boolean
    depositEnabled: boolean
    createdAt: Date
    updatedAt: Date
    _count: CurrencyCountAggregateOutputType | null
    _min: CurrencyMinAggregateOutputType | null
    _max: CurrencyMaxAggregateOutputType | null
  }

  type GetCurrencyGroupByPayload<T extends CurrencyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CurrencyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CurrencyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CurrencyGroupByOutputType[P]>
            : GetScalarType<T[P], CurrencyGroupByOutputType[P]>
        }
      >
    >


  export type CurrencySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    code?: boolean
    name?: boolean
    symbol?: boolean
    country?: boolean
    region?: boolean
    flag?: boolean
    enabled?: boolean
    depositEnabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    balances?: boolean | Currency$balancesArgs<ExtArgs>
    deposits?: boolean | Currency$depositsArgs<ExtArgs>
    transactions?: boolean | Currency$transactionsArgs<ExtArgs>
    ledgerEntries?: boolean | Currency$ledgerEntriesArgs<ExtArgs>
    _count?: boolean | CurrencyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["currency"]>

  export type CurrencySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    code?: boolean
    name?: boolean
    symbol?: boolean
    country?: boolean
    region?: boolean
    flag?: boolean
    enabled?: boolean
    depositEnabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["currency"]>

  export type CurrencySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    code?: boolean
    name?: boolean
    symbol?: boolean
    country?: boolean
    region?: boolean
    flag?: boolean
    enabled?: boolean
    depositEnabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["currency"]>

  export type CurrencySelectScalar = {
    code?: boolean
    name?: boolean
    symbol?: boolean
    country?: boolean
    region?: boolean
    flag?: boolean
    enabled?: boolean
    depositEnabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CurrencyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"code" | "name" | "symbol" | "country" | "region" | "flag" | "enabled" | "depositEnabled" | "createdAt" | "updatedAt", ExtArgs["result"]["currency"]>
  export type CurrencyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    balances?: boolean | Currency$balancesArgs<ExtArgs>
    deposits?: boolean | Currency$depositsArgs<ExtArgs>
    transactions?: boolean | Currency$transactionsArgs<ExtArgs>
    ledgerEntries?: boolean | Currency$ledgerEntriesArgs<ExtArgs>
    _count?: boolean | CurrencyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CurrencyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CurrencyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CurrencyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Currency"
    objects: {
      balances: Prisma.$WalletBalancePayload<ExtArgs>[]
      deposits: Prisma.$DepositPayload<ExtArgs>[]
      transactions: Prisma.$TransactionPayload<ExtArgs>[]
      ledgerEntries: Prisma.$LedgerEntryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      code: string
      name: string
      symbol: string | null
      country: string | null
      region: string | null
      flag: string | null
      enabled: boolean
      depositEnabled: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["currency"]>
    composites: {}
  }

  type CurrencyGetPayload<S extends boolean | null | undefined | CurrencyDefaultArgs> = $Result.GetResult<Prisma.$CurrencyPayload, S>

  type CurrencyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CurrencyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CurrencyCountAggregateInputType | true
    }

  export interface CurrencyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Currency'], meta: { name: 'Currency' } }
    /**
     * Find zero or one Currency that matches the filter.
     * @param {CurrencyFindUniqueArgs} args - Arguments to find a Currency
     * @example
     * // Get one Currency
     * const currency = await prisma.currency.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CurrencyFindUniqueArgs>(args: SelectSubset<T, CurrencyFindUniqueArgs<ExtArgs>>): Prisma__CurrencyClient<$Result.GetResult<Prisma.$CurrencyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Currency that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CurrencyFindUniqueOrThrowArgs} args - Arguments to find a Currency
     * @example
     * // Get one Currency
     * const currency = await prisma.currency.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CurrencyFindUniqueOrThrowArgs>(args: SelectSubset<T, CurrencyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CurrencyClient<$Result.GetResult<Prisma.$CurrencyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Currency that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CurrencyFindFirstArgs} args - Arguments to find a Currency
     * @example
     * // Get one Currency
     * const currency = await prisma.currency.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CurrencyFindFirstArgs>(args?: SelectSubset<T, CurrencyFindFirstArgs<ExtArgs>>): Prisma__CurrencyClient<$Result.GetResult<Prisma.$CurrencyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Currency that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CurrencyFindFirstOrThrowArgs} args - Arguments to find a Currency
     * @example
     * // Get one Currency
     * const currency = await prisma.currency.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CurrencyFindFirstOrThrowArgs>(args?: SelectSubset<T, CurrencyFindFirstOrThrowArgs<ExtArgs>>): Prisma__CurrencyClient<$Result.GetResult<Prisma.$CurrencyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Currencies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CurrencyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Currencies
     * const currencies = await prisma.currency.findMany()
     * 
     * // Get first 10 Currencies
     * const currencies = await prisma.currency.findMany({ take: 10 })
     * 
     * // Only select the `code`
     * const currencyWithCodeOnly = await prisma.currency.findMany({ select: { code: true } })
     * 
     */
    findMany<T extends CurrencyFindManyArgs>(args?: SelectSubset<T, CurrencyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CurrencyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Currency.
     * @param {CurrencyCreateArgs} args - Arguments to create a Currency.
     * @example
     * // Create one Currency
     * const Currency = await prisma.currency.create({
     *   data: {
     *     // ... data to create a Currency
     *   }
     * })
     * 
     */
    create<T extends CurrencyCreateArgs>(args: SelectSubset<T, CurrencyCreateArgs<ExtArgs>>): Prisma__CurrencyClient<$Result.GetResult<Prisma.$CurrencyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Currencies.
     * @param {CurrencyCreateManyArgs} args - Arguments to create many Currencies.
     * @example
     * // Create many Currencies
     * const currency = await prisma.currency.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CurrencyCreateManyArgs>(args?: SelectSubset<T, CurrencyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Currencies and returns the data saved in the database.
     * @param {CurrencyCreateManyAndReturnArgs} args - Arguments to create many Currencies.
     * @example
     * // Create many Currencies
     * const currency = await prisma.currency.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Currencies and only return the `code`
     * const currencyWithCodeOnly = await prisma.currency.createManyAndReturn({
     *   select: { code: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CurrencyCreateManyAndReturnArgs>(args?: SelectSubset<T, CurrencyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CurrencyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Currency.
     * @param {CurrencyDeleteArgs} args - Arguments to delete one Currency.
     * @example
     * // Delete one Currency
     * const Currency = await prisma.currency.delete({
     *   where: {
     *     // ... filter to delete one Currency
     *   }
     * })
     * 
     */
    delete<T extends CurrencyDeleteArgs>(args: SelectSubset<T, CurrencyDeleteArgs<ExtArgs>>): Prisma__CurrencyClient<$Result.GetResult<Prisma.$CurrencyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Currency.
     * @param {CurrencyUpdateArgs} args - Arguments to update one Currency.
     * @example
     * // Update one Currency
     * const currency = await prisma.currency.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CurrencyUpdateArgs>(args: SelectSubset<T, CurrencyUpdateArgs<ExtArgs>>): Prisma__CurrencyClient<$Result.GetResult<Prisma.$CurrencyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Currencies.
     * @param {CurrencyDeleteManyArgs} args - Arguments to filter Currencies to delete.
     * @example
     * // Delete a few Currencies
     * const { count } = await prisma.currency.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CurrencyDeleteManyArgs>(args?: SelectSubset<T, CurrencyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Currencies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CurrencyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Currencies
     * const currency = await prisma.currency.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CurrencyUpdateManyArgs>(args: SelectSubset<T, CurrencyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Currencies and returns the data updated in the database.
     * @param {CurrencyUpdateManyAndReturnArgs} args - Arguments to update many Currencies.
     * @example
     * // Update many Currencies
     * const currency = await prisma.currency.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Currencies and only return the `code`
     * const currencyWithCodeOnly = await prisma.currency.updateManyAndReturn({
     *   select: { code: true },
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
    updateManyAndReturn<T extends CurrencyUpdateManyAndReturnArgs>(args: SelectSubset<T, CurrencyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CurrencyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Currency.
     * @param {CurrencyUpsertArgs} args - Arguments to update or create a Currency.
     * @example
     * // Update or create a Currency
     * const currency = await prisma.currency.upsert({
     *   create: {
     *     // ... data to create a Currency
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Currency we want to update
     *   }
     * })
     */
    upsert<T extends CurrencyUpsertArgs>(args: SelectSubset<T, CurrencyUpsertArgs<ExtArgs>>): Prisma__CurrencyClient<$Result.GetResult<Prisma.$CurrencyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Currencies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CurrencyCountArgs} args - Arguments to filter Currencies to count.
     * @example
     * // Count the number of Currencies
     * const count = await prisma.currency.count({
     *   where: {
     *     // ... the filter for the Currencies we want to count
     *   }
     * })
    **/
    count<T extends CurrencyCountArgs>(
      args?: Subset<T, CurrencyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CurrencyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Currency.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CurrencyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CurrencyAggregateArgs>(args: Subset<T, CurrencyAggregateArgs>): Prisma.PrismaPromise<GetCurrencyAggregateType<T>>

    /**
     * Group by Currency.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CurrencyGroupByArgs} args - Group by arguments.
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
      T extends CurrencyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CurrencyGroupByArgs['orderBy'] }
        : { orderBy?: CurrencyGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CurrencyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCurrencyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Currency model
   */
  readonly fields: CurrencyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Currency.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CurrencyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    balances<T extends Currency$balancesArgs<ExtArgs> = {}>(args?: Subset<T, Currency$balancesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WalletBalancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    deposits<T extends Currency$depositsArgs<ExtArgs> = {}>(args?: Subset<T, Currency$depositsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transactions<T extends Currency$transactionsArgs<ExtArgs> = {}>(args?: Subset<T, Currency$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ledgerEntries<T extends Currency$ledgerEntriesArgs<ExtArgs> = {}>(args?: Subset<T, Currency$ledgerEntriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Currency model
   */
  interface CurrencyFieldRefs {
    readonly code: FieldRef<"Currency", 'String'>
    readonly name: FieldRef<"Currency", 'String'>
    readonly symbol: FieldRef<"Currency", 'String'>
    readonly country: FieldRef<"Currency", 'String'>
    readonly region: FieldRef<"Currency", 'String'>
    readonly flag: FieldRef<"Currency", 'String'>
    readonly enabled: FieldRef<"Currency", 'Boolean'>
    readonly depositEnabled: FieldRef<"Currency", 'Boolean'>
    readonly createdAt: FieldRef<"Currency", 'DateTime'>
    readonly updatedAt: FieldRef<"Currency", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Currency findUnique
   */
  export type CurrencyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Currency
     */
    select?: CurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Currency
     */
    omit?: CurrencyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CurrencyInclude<ExtArgs> | null
    /**
     * Filter, which Currency to fetch.
     */
    where: CurrencyWhereUniqueInput
  }

  /**
   * Currency findUniqueOrThrow
   */
  export type CurrencyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Currency
     */
    select?: CurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Currency
     */
    omit?: CurrencyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CurrencyInclude<ExtArgs> | null
    /**
     * Filter, which Currency to fetch.
     */
    where: CurrencyWhereUniqueInput
  }

  /**
   * Currency findFirst
   */
  export type CurrencyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Currency
     */
    select?: CurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Currency
     */
    omit?: CurrencyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CurrencyInclude<ExtArgs> | null
    /**
     * Filter, which Currency to fetch.
     */
    where?: CurrencyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Currencies to fetch.
     */
    orderBy?: CurrencyOrderByWithRelationInput | CurrencyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Currencies.
     */
    cursor?: CurrencyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Currencies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Currencies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Currencies.
     */
    distinct?: CurrencyScalarFieldEnum | CurrencyScalarFieldEnum[]
  }

  /**
   * Currency findFirstOrThrow
   */
  export type CurrencyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Currency
     */
    select?: CurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Currency
     */
    omit?: CurrencyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CurrencyInclude<ExtArgs> | null
    /**
     * Filter, which Currency to fetch.
     */
    where?: CurrencyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Currencies to fetch.
     */
    orderBy?: CurrencyOrderByWithRelationInput | CurrencyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Currencies.
     */
    cursor?: CurrencyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Currencies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Currencies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Currencies.
     */
    distinct?: CurrencyScalarFieldEnum | CurrencyScalarFieldEnum[]
  }

  /**
   * Currency findMany
   */
  export type CurrencyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Currency
     */
    select?: CurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Currency
     */
    omit?: CurrencyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CurrencyInclude<ExtArgs> | null
    /**
     * Filter, which Currencies to fetch.
     */
    where?: CurrencyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Currencies to fetch.
     */
    orderBy?: CurrencyOrderByWithRelationInput | CurrencyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Currencies.
     */
    cursor?: CurrencyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Currencies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Currencies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Currencies.
     */
    distinct?: CurrencyScalarFieldEnum | CurrencyScalarFieldEnum[]
  }

  /**
   * Currency create
   */
  export type CurrencyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Currency
     */
    select?: CurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Currency
     */
    omit?: CurrencyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CurrencyInclude<ExtArgs> | null
    /**
     * The data needed to create a Currency.
     */
    data: XOR<CurrencyCreateInput, CurrencyUncheckedCreateInput>
  }

  /**
   * Currency createMany
   */
  export type CurrencyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Currencies.
     */
    data: CurrencyCreateManyInput | CurrencyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Currency createManyAndReturn
   */
  export type CurrencyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Currency
     */
    select?: CurrencySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Currency
     */
    omit?: CurrencyOmit<ExtArgs> | null
    /**
     * The data used to create many Currencies.
     */
    data: CurrencyCreateManyInput | CurrencyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Currency update
   */
  export type CurrencyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Currency
     */
    select?: CurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Currency
     */
    omit?: CurrencyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CurrencyInclude<ExtArgs> | null
    /**
     * The data needed to update a Currency.
     */
    data: XOR<CurrencyUpdateInput, CurrencyUncheckedUpdateInput>
    /**
     * Choose, which Currency to update.
     */
    where: CurrencyWhereUniqueInput
  }

  /**
   * Currency updateMany
   */
  export type CurrencyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Currencies.
     */
    data: XOR<CurrencyUpdateManyMutationInput, CurrencyUncheckedUpdateManyInput>
    /**
     * Filter which Currencies to update
     */
    where?: CurrencyWhereInput
    /**
     * Limit how many Currencies to update.
     */
    limit?: number
  }

  /**
   * Currency updateManyAndReturn
   */
  export type CurrencyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Currency
     */
    select?: CurrencySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Currency
     */
    omit?: CurrencyOmit<ExtArgs> | null
    /**
     * The data used to update Currencies.
     */
    data: XOR<CurrencyUpdateManyMutationInput, CurrencyUncheckedUpdateManyInput>
    /**
     * Filter which Currencies to update
     */
    where?: CurrencyWhereInput
    /**
     * Limit how many Currencies to update.
     */
    limit?: number
  }

  /**
   * Currency upsert
   */
  export type CurrencyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Currency
     */
    select?: CurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Currency
     */
    omit?: CurrencyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CurrencyInclude<ExtArgs> | null
    /**
     * The filter to search for the Currency to update in case it exists.
     */
    where: CurrencyWhereUniqueInput
    /**
     * In case the Currency found by the `where` argument doesn't exist, create a new Currency with this data.
     */
    create: XOR<CurrencyCreateInput, CurrencyUncheckedCreateInput>
    /**
     * In case the Currency was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CurrencyUpdateInput, CurrencyUncheckedUpdateInput>
  }

  /**
   * Currency delete
   */
  export type CurrencyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Currency
     */
    select?: CurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Currency
     */
    omit?: CurrencyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CurrencyInclude<ExtArgs> | null
    /**
     * Filter which Currency to delete.
     */
    where: CurrencyWhereUniqueInput
  }

  /**
   * Currency deleteMany
   */
  export type CurrencyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Currencies to delete
     */
    where?: CurrencyWhereInput
    /**
     * Limit how many Currencies to delete.
     */
    limit?: number
  }

  /**
   * Currency.balances
   */
  export type Currency$balancesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WalletBalance
     */
    omit?: WalletBalanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceInclude<ExtArgs> | null
    where?: WalletBalanceWhereInput
    orderBy?: WalletBalanceOrderByWithRelationInput | WalletBalanceOrderByWithRelationInput[]
    cursor?: WalletBalanceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WalletBalanceScalarFieldEnum | WalletBalanceScalarFieldEnum[]
  }

  /**
   * Currency.deposits
   */
  export type Currency$depositsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposit
     */
    select?: DepositSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deposit
     */
    omit?: DepositOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositInclude<ExtArgs> | null
    where?: DepositWhereInput
    orderBy?: DepositOrderByWithRelationInput | DepositOrderByWithRelationInput[]
    cursor?: DepositWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DepositScalarFieldEnum | DepositScalarFieldEnum[]
  }

  /**
   * Currency.transactions
   */
  export type Currency$transactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Currency.ledgerEntries
   */
  export type Currency$ledgerEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryInclude<ExtArgs> | null
    where?: LedgerEntryWhereInput
    orderBy?: LedgerEntryOrderByWithRelationInput | LedgerEntryOrderByWithRelationInput[]
    cursor?: LedgerEntryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LedgerEntryScalarFieldEnum | LedgerEntryScalarFieldEnum[]
  }

  /**
   * Currency without action
   */
  export type CurrencyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Currency
     */
    select?: CurrencySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Currency
     */
    omit?: CurrencyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CurrencyInclude<ExtArgs> | null
  }


  /**
   * Model WalletBalance
   */

  export type AggregateWalletBalance = {
    _count: WalletBalanceCountAggregateOutputType | null
    _avg: WalletBalanceAvgAggregateOutputType | null
    _sum: WalletBalanceSumAggregateOutputType | null
    _min: WalletBalanceMinAggregateOutputType | null
    _max: WalletBalanceMaxAggregateOutputType | null
  }

  export type WalletBalanceAvgAggregateOutputType = {
    availableBalance: Decimal | null
    pendingBalance: Decimal | null
  }

  export type WalletBalanceSumAggregateOutputType = {
    availableBalance: Decimal | null
    pendingBalance: Decimal | null
  }

  export type WalletBalanceMinAggregateOutputType = {
    id: string | null
    walletId: string | null
    currencyCode: string | null
    availableBalance: Decimal | null
    pendingBalance: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WalletBalanceMaxAggregateOutputType = {
    id: string | null
    walletId: string | null
    currencyCode: string | null
    availableBalance: Decimal | null
    pendingBalance: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WalletBalanceCountAggregateOutputType = {
    id: number
    walletId: number
    currencyCode: number
    availableBalance: number
    pendingBalance: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WalletBalanceAvgAggregateInputType = {
    availableBalance?: true
    pendingBalance?: true
  }

  export type WalletBalanceSumAggregateInputType = {
    availableBalance?: true
    pendingBalance?: true
  }

  export type WalletBalanceMinAggregateInputType = {
    id?: true
    walletId?: true
    currencyCode?: true
    availableBalance?: true
    pendingBalance?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WalletBalanceMaxAggregateInputType = {
    id?: true
    walletId?: true
    currencyCode?: true
    availableBalance?: true
    pendingBalance?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WalletBalanceCountAggregateInputType = {
    id?: true
    walletId?: true
    currencyCode?: true
    availableBalance?: true
    pendingBalance?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WalletBalanceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WalletBalance to aggregate.
     */
    where?: WalletBalanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WalletBalances to fetch.
     */
    orderBy?: WalletBalanceOrderByWithRelationInput | WalletBalanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WalletBalanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WalletBalances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WalletBalances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WalletBalances
    **/
    _count?: true | WalletBalanceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WalletBalanceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WalletBalanceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WalletBalanceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WalletBalanceMaxAggregateInputType
  }

  export type GetWalletBalanceAggregateType<T extends WalletBalanceAggregateArgs> = {
        [P in keyof T & keyof AggregateWalletBalance]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWalletBalance[P]>
      : GetScalarType<T[P], AggregateWalletBalance[P]>
  }




  export type WalletBalanceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WalletBalanceWhereInput
    orderBy?: WalletBalanceOrderByWithAggregationInput | WalletBalanceOrderByWithAggregationInput[]
    by: WalletBalanceScalarFieldEnum[] | WalletBalanceScalarFieldEnum
    having?: WalletBalanceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WalletBalanceCountAggregateInputType | true
    _avg?: WalletBalanceAvgAggregateInputType
    _sum?: WalletBalanceSumAggregateInputType
    _min?: WalletBalanceMinAggregateInputType
    _max?: WalletBalanceMaxAggregateInputType
  }

  export type WalletBalanceGroupByOutputType = {
    id: string
    walletId: string
    currencyCode: string
    availableBalance: Decimal
    pendingBalance: Decimal
    createdAt: Date
    updatedAt: Date
    _count: WalletBalanceCountAggregateOutputType | null
    _avg: WalletBalanceAvgAggregateOutputType | null
    _sum: WalletBalanceSumAggregateOutputType | null
    _min: WalletBalanceMinAggregateOutputType | null
    _max: WalletBalanceMaxAggregateOutputType | null
  }

  type GetWalletBalanceGroupByPayload<T extends WalletBalanceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WalletBalanceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WalletBalanceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WalletBalanceGroupByOutputType[P]>
            : GetScalarType<T[P], WalletBalanceGroupByOutputType[P]>
        }
      >
    >


  export type WalletBalanceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    walletId?: boolean
    currencyCode?: boolean
    availableBalance?: boolean
    pendingBalance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    currency?: boolean | CurrencyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["walletBalance"]>

  export type WalletBalanceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    walletId?: boolean
    currencyCode?: boolean
    availableBalance?: boolean
    pendingBalance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    currency?: boolean | CurrencyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["walletBalance"]>

  export type WalletBalanceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    walletId?: boolean
    currencyCode?: boolean
    availableBalance?: boolean
    pendingBalance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    currency?: boolean | CurrencyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["walletBalance"]>

  export type WalletBalanceSelectScalar = {
    id?: boolean
    walletId?: boolean
    currencyCode?: boolean
    availableBalance?: boolean
    pendingBalance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WalletBalanceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "walletId" | "currencyCode" | "availableBalance" | "pendingBalance" | "createdAt" | "updatedAt", ExtArgs["result"]["walletBalance"]>
  export type WalletBalanceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    currency?: boolean | CurrencyDefaultArgs<ExtArgs>
  }
  export type WalletBalanceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    currency?: boolean | CurrencyDefaultArgs<ExtArgs>
  }
  export type WalletBalanceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    currency?: boolean | CurrencyDefaultArgs<ExtArgs>
  }

  export type $WalletBalancePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WalletBalance"
    objects: {
      wallet: Prisma.$WalletPayload<ExtArgs>
      currency: Prisma.$CurrencyPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      walletId: string
      currencyCode: string
      availableBalance: Prisma.Decimal
      pendingBalance: Prisma.Decimal
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["walletBalance"]>
    composites: {}
  }

  type WalletBalanceGetPayload<S extends boolean | null | undefined | WalletBalanceDefaultArgs> = $Result.GetResult<Prisma.$WalletBalancePayload, S>

  type WalletBalanceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WalletBalanceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WalletBalanceCountAggregateInputType | true
    }

  export interface WalletBalanceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WalletBalance'], meta: { name: 'WalletBalance' } }
    /**
     * Find zero or one WalletBalance that matches the filter.
     * @param {WalletBalanceFindUniqueArgs} args - Arguments to find a WalletBalance
     * @example
     * // Get one WalletBalance
     * const walletBalance = await prisma.walletBalance.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WalletBalanceFindUniqueArgs>(args: SelectSubset<T, WalletBalanceFindUniqueArgs<ExtArgs>>): Prisma__WalletBalanceClient<$Result.GetResult<Prisma.$WalletBalancePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WalletBalance that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WalletBalanceFindUniqueOrThrowArgs} args - Arguments to find a WalletBalance
     * @example
     * // Get one WalletBalance
     * const walletBalance = await prisma.walletBalance.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WalletBalanceFindUniqueOrThrowArgs>(args: SelectSubset<T, WalletBalanceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WalletBalanceClient<$Result.GetResult<Prisma.$WalletBalancePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WalletBalance that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletBalanceFindFirstArgs} args - Arguments to find a WalletBalance
     * @example
     * // Get one WalletBalance
     * const walletBalance = await prisma.walletBalance.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WalletBalanceFindFirstArgs>(args?: SelectSubset<T, WalletBalanceFindFirstArgs<ExtArgs>>): Prisma__WalletBalanceClient<$Result.GetResult<Prisma.$WalletBalancePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WalletBalance that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletBalanceFindFirstOrThrowArgs} args - Arguments to find a WalletBalance
     * @example
     * // Get one WalletBalance
     * const walletBalance = await prisma.walletBalance.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WalletBalanceFindFirstOrThrowArgs>(args?: SelectSubset<T, WalletBalanceFindFirstOrThrowArgs<ExtArgs>>): Prisma__WalletBalanceClient<$Result.GetResult<Prisma.$WalletBalancePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WalletBalances that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletBalanceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WalletBalances
     * const walletBalances = await prisma.walletBalance.findMany()
     * 
     * // Get first 10 WalletBalances
     * const walletBalances = await prisma.walletBalance.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const walletBalanceWithIdOnly = await prisma.walletBalance.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WalletBalanceFindManyArgs>(args?: SelectSubset<T, WalletBalanceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WalletBalancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WalletBalance.
     * @param {WalletBalanceCreateArgs} args - Arguments to create a WalletBalance.
     * @example
     * // Create one WalletBalance
     * const WalletBalance = await prisma.walletBalance.create({
     *   data: {
     *     // ... data to create a WalletBalance
     *   }
     * })
     * 
     */
    create<T extends WalletBalanceCreateArgs>(args: SelectSubset<T, WalletBalanceCreateArgs<ExtArgs>>): Prisma__WalletBalanceClient<$Result.GetResult<Prisma.$WalletBalancePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WalletBalances.
     * @param {WalletBalanceCreateManyArgs} args - Arguments to create many WalletBalances.
     * @example
     * // Create many WalletBalances
     * const walletBalance = await prisma.walletBalance.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WalletBalanceCreateManyArgs>(args?: SelectSubset<T, WalletBalanceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WalletBalances and returns the data saved in the database.
     * @param {WalletBalanceCreateManyAndReturnArgs} args - Arguments to create many WalletBalances.
     * @example
     * // Create many WalletBalances
     * const walletBalance = await prisma.walletBalance.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WalletBalances and only return the `id`
     * const walletBalanceWithIdOnly = await prisma.walletBalance.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WalletBalanceCreateManyAndReturnArgs>(args?: SelectSubset<T, WalletBalanceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WalletBalancePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WalletBalance.
     * @param {WalletBalanceDeleteArgs} args - Arguments to delete one WalletBalance.
     * @example
     * // Delete one WalletBalance
     * const WalletBalance = await prisma.walletBalance.delete({
     *   where: {
     *     // ... filter to delete one WalletBalance
     *   }
     * })
     * 
     */
    delete<T extends WalletBalanceDeleteArgs>(args: SelectSubset<T, WalletBalanceDeleteArgs<ExtArgs>>): Prisma__WalletBalanceClient<$Result.GetResult<Prisma.$WalletBalancePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WalletBalance.
     * @param {WalletBalanceUpdateArgs} args - Arguments to update one WalletBalance.
     * @example
     * // Update one WalletBalance
     * const walletBalance = await prisma.walletBalance.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WalletBalanceUpdateArgs>(args: SelectSubset<T, WalletBalanceUpdateArgs<ExtArgs>>): Prisma__WalletBalanceClient<$Result.GetResult<Prisma.$WalletBalancePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WalletBalances.
     * @param {WalletBalanceDeleteManyArgs} args - Arguments to filter WalletBalances to delete.
     * @example
     * // Delete a few WalletBalances
     * const { count } = await prisma.walletBalance.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WalletBalanceDeleteManyArgs>(args?: SelectSubset<T, WalletBalanceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WalletBalances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletBalanceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WalletBalances
     * const walletBalance = await prisma.walletBalance.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WalletBalanceUpdateManyArgs>(args: SelectSubset<T, WalletBalanceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WalletBalances and returns the data updated in the database.
     * @param {WalletBalanceUpdateManyAndReturnArgs} args - Arguments to update many WalletBalances.
     * @example
     * // Update many WalletBalances
     * const walletBalance = await prisma.walletBalance.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WalletBalances and only return the `id`
     * const walletBalanceWithIdOnly = await prisma.walletBalance.updateManyAndReturn({
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
    updateManyAndReturn<T extends WalletBalanceUpdateManyAndReturnArgs>(args: SelectSubset<T, WalletBalanceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WalletBalancePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WalletBalance.
     * @param {WalletBalanceUpsertArgs} args - Arguments to update or create a WalletBalance.
     * @example
     * // Update or create a WalletBalance
     * const walletBalance = await prisma.walletBalance.upsert({
     *   create: {
     *     // ... data to create a WalletBalance
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WalletBalance we want to update
     *   }
     * })
     */
    upsert<T extends WalletBalanceUpsertArgs>(args: SelectSubset<T, WalletBalanceUpsertArgs<ExtArgs>>): Prisma__WalletBalanceClient<$Result.GetResult<Prisma.$WalletBalancePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WalletBalances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletBalanceCountArgs} args - Arguments to filter WalletBalances to count.
     * @example
     * // Count the number of WalletBalances
     * const count = await prisma.walletBalance.count({
     *   where: {
     *     // ... the filter for the WalletBalances we want to count
     *   }
     * })
    **/
    count<T extends WalletBalanceCountArgs>(
      args?: Subset<T, WalletBalanceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WalletBalanceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WalletBalance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletBalanceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends WalletBalanceAggregateArgs>(args: Subset<T, WalletBalanceAggregateArgs>): Prisma.PrismaPromise<GetWalletBalanceAggregateType<T>>

    /**
     * Group by WalletBalance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletBalanceGroupByArgs} args - Group by arguments.
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
      T extends WalletBalanceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WalletBalanceGroupByArgs['orderBy'] }
        : { orderBy?: WalletBalanceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, WalletBalanceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWalletBalanceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WalletBalance model
   */
  readonly fields: WalletBalanceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WalletBalance.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WalletBalanceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    wallet<T extends WalletDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WalletDefaultArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    currency<T extends CurrencyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CurrencyDefaultArgs<ExtArgs>>): Prisma__CurrencyClient<$Result.GetResult<Prisma.$CurrencyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the WalletBalance model
   */
  interface WalletBalanceFieldRefs {
    readonly id: FieldRef<"WalletBalance", 'String'>
    readonly walletId: FieldRef<"WalletBalance", 'String'>
    readonly currencyCode: FieldRef<"WalletBalance", 'String'>
    readonly availableBalance: FieldRef<"WalletBalance", 'Decimal'>
    readonly pendingBalance: FieldRef<"WalletBalance", 'Decimal'>
    readonly createdAt: FieldRef<"WalletBalance", 'DateTime'>
    readonly updatedAt: FieldRef<"WalletBalance", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WalletBalance findUnique
   */
  export type WalletBalanceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WalletBalance
     */
    omit?: WalletBalanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceInclude<ExtArgs> | null
    /**
     * Filter, which WalletBalance to fetch.
     */
    where: WalletBalanceWhereUniqueInput
  }

  /**
   * WalletBalance findUniqueOrThrow
   */
  export type WalletBalanceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WalletBalance
     */
    omit?: WalletBalanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceInclude<ExtArgs> | null
    /**
     * Filter, which WalletBalance to fetch.
     */
    where: WalletBalanceWhereUniqueInput
  }

  /**
   * WalletBalance findFirst
   */
  export type WalletBalanceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WalletBalance
     */
    omit?: WalletBalanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceInclude<ExtArgs> | null
    /**
     * Filter, which WalletBalance to fetch.
     */
    where?: WalletBalanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WalletBalances to fetch.
     */
    orderBy?: WalletBalanceOrderByWithRelationInput | WalletBalanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WalletBalances.
     */
    cursor?: WalletBalanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WalletBalances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WalletBalances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WalletBalances.
     */
    distinct?: WalletBalanceScalarFieldEnum | WalletBalanceScalarFieldEnum[]
  }

  /**
   * WalletBalance findFirstOrThrow
   */
  export type WalletBalanceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WalletBalance
     */
    omit?: WalletBalanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceInclude<ExtArgs> | null
    /**
     * Filter, which WalletBalance to fetch.
     */
    where?: WalletBalanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WalletBalances to fetch.
     */
    orderBy?: WalletBalanceOrderByWithRelationInput | WalletBalanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WalletBalances.
     */
    cursor?: WalletBalanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WalletBalances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WalletBalances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WalletBalances.
     */
    distinct?: WalletBalanceScalarFieldEnum | WalletBalanceScalarFieldEnum[]
  }

  /**
   * WalletBalance findMany
   */
  export type WalletBalanceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WalletBalance
     */
    omit?: WalletBalanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceInclude<ExtArgs> | null
    /**
     * Filter, which WalletBalances to fetch.
     */
    where?: WalletBalanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WalletBalances to fetch.
     */
    orderBy?: WalletBalanceOrderByWithRelationInput | WalletBalanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WalletBalances.
     */
    cursor?: WalletBalanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WalletBalances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WalletBalances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WalletBalances.
     */
    distinct?: WalletBalanceScalarFieldEnum | WalletBalanceScalarFieldEnum[]
  }

  /**
   * WalletBalance create
   */
  export type WalletBalanceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WalletBalance
     */
    omit?: WalletBalanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceInclude<ExtArgs> | null
    /**
     * The data needed to create a WalletBalance.
     */
    data: XOR<WalletBalanceCreateInput, WalletBalanceUncheckedCreateInput>
  }

  /**
   * WalletBalance createMany
   */
  export type WalletBalanceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WalletBalances.
     */
    data: WalletBalanceCreateManyInput | WalletBalanceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WalletBalance createManyAndReturn
   */
  export type WalletBalanceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WalletBalance
     */
    omit?: WalletBalanceOmit<ExtArgs> | null
    /**
     * The data used to create many WalletBalances.
     */
    data: WalletBalanceCreateManyInput | WalletBalanceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WalletBalance update
   */
  export type WalletBalanceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WalletBalance
     */
    omit?: WalletBalanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceInclude<ExtArgs> | null
    /**
     * The data needed to update a WalletBalance.
     */
    data: XOR<WalletBalanceUpdateInput, WalletBalanceUncheckedUpdateInput>
    /**
     * Choose, which WalletBalance to update.
     */
    where: WalletBalanceWhereUniqueInput
  }

  /**
   * WalletBalance updateMany
   */
  export type WalletBalanceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WalletBalances.
     */
    data: XOR<WalletBalanceUpdateManyMutationInput, WalletBalanceUncheckedUpdateManyInput>
    /**
     * Filter which WalletBalances to update
     */
    where?: WalletBalanceWhereInput
    /**
     * Limit how many WalletBalances to update.
     */
    limit?: number
  }

  /**
   * WalletBalance updateManyAndReturn
   */
  export type WalletBalanceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WalletBalance
     */
    omit?: WalletBalanceOmit<ExtArgs> | null
    /**
     * The data used to update WalletBalances.
     */
    data: XOR<WalletBalanceUpdateManyMutationInput, WalletBalanceUncheckedUpdateManyInput>
    /**
     * Filter which WalletBalances to update
     */
    where?: WalletBalanceWhereInput
    /**
     * Limit how many WalletBalances to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WalletBalance upsert
   */
  export type WalletBalanceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WalletBalance
     */
    omit?: WalletBalanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceInclude<ExtArgs> | null
    /**
     * The filter to search for the WalletBalance to update in case it exists.
     */
    where: WalletBalanceWhereUniqueInput
    /**
     * In case the WalletBalance found by the `where` argument doesn't exist, create a new WalletBalance with this data.
     */
    create: XOR<WalletBalanceCreateInput, WalletBalanceUncheckedCreateInput>
    /**
     * In case the WalletBalance was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WalletBalanceUpdateInput, WalletBalanceUncheckedUpdateInput>
  }

  /**
   * WalletBalance delete
   */
  export type WalletBalanceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WalletBalance
     */
    omit?: WalletBalanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceInclude<ExtArgs> | null
    /**
     * Filter which WalletBalance to delete.
     */
    where: WalletBalanceWhereUniqueInput
  }

  /**
   * WalletBalance deleteMany
   */
  export type WalletBalanceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WalletBalances to delete
     */
    where?: WalletBalanceWhereInput
    /**
     * Limit how many WalletBalances to delete.
     */
    limit?: number
  }

  /**
   * WalletBalance without action
   */
  export type WalletBalanceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WalletBalance
     */
    omit?: WalletBalanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceInclude<ExtArgs> | null
  }


  /**
   * Model Deposit
   */

  export type AggregateDeposit = {
    _count: DepositCountAggregateOutputType | null
    _avg: DepositAvgAggregateOutputType | null
    _sum: DepositSumAggregateOutputType | null
    _min: DepositMinAggregateOutputType | null
    _max: DepositMaxAggregateOutputType | null
  }

  export type DepositAvgAggregateOutputType = {
    amount: Decimal | null
    fee: Decimal | null
    netAmount: Decimal | null
    exchangeRate: Decimal | null
  }

  export type DepositSumAggregateOutputType = {
    amount: Decimal | null
    fee: Decimal | null
    netAmount: Decimal | null
    exchangeRate: Decimal | null
  }

  export type DepositMinAggregateOutputType = {
    id: string | null
    userId: string | null
    walletId: string | null
    currencyCode: string | null
    amount: Decimal | null
    fee: Decimal | null
    netAmount: Decimal | null
    exchangeRate: Decimal | null
    provider: $Enums.PaymentProvider | null
    providerTransactionId: string | null
    providerReference: string | null
    paymentMethod: $Enums.PaymentMethod | null
    country: string | null
    countryCode: string | null
    status: $Enums.DepositStatus | null
    idempotencyKey: string | null
    createdAt: Date | null
    updatedAt: Date | null
    transactionId: string | null
  }

  export type DepositMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    walletId: string | null
    currencyCode: string | null
    amount: Decimal | null
    fee: Decimal | null
    netAmount: Decimal | null
    exchangeRate: Decimal | null
    provider: $Enums.PaymentProvider | null
    providerTransactionId: string | null
    providerReference: string | null
    paymentMethod: $Enums.PaymentMethod | null
    country: string | null
    countryCode: string | null
    status: $Enums.DepositStatus | null
    idempotencyKey: string | null
    createdAt: Date | null
    updatedAt: Date | null
    transactionId: string | null
  }

  export type DepositCountAggregateOutputType = {
    id: number
    userId: number
    walletId: number
    currencyCode: number
    amount: number
    fee: number
    netAmount: number
    exchangeRate: number
    provider: number
    providerTransactionId: number
    providerReference: number
    paymentMethod: number
    country: number
    countryCode: number
    status: number
    idempotencyKey: number
    metadata: number
    createdAt: number
    updatedAt: number
    transactionId: number
    _all: number
  }


  export type DepositAvgAggregateInputType = {
    amount?: true
    fee?: true
    netAmount?: true
    exchangeRate?: true
  }

  export type DepositSumAggregateInputType = {
    amount?: true
    fee?: true
    netAmount?: true
    exchangeRate?: true
  }

  export type DepositMinAggregateInputType = {
    id?: true
    userId?: true
    walletId?: true
    currencyCode?: true
    amount?: true
    fee?: true
    netAmount?: true
    exchangeRate?: true
    provider?: true
    providerTransactionId?: true
    providerReference?: true
    paymentMethod?: true
    country?: true
    countryCode?: true
    status?: true
    idempotencyKey?: true
    createdAt?: true
    updatedAt?: true
    transactionId?: true
  }

  export type DepositMaxAggregateInputType = {
    id?: true
    userId?: true
    walletId?: true
    currencyCode?: true
    amount?: true
    fee?: true
    netAmount?: true
    exchangeRate?: true
    provider?: true
    providerTransactionId?: true
    providerReference?: true
    paymentMethod?: true
    country?: true
    countryCode?: true
    status?: true
    idempotencyKey?: true
    createdAt?: true
    updatedAt?: true
    transactionId?: true
  }

  export type DepositCountAggregateInputType = {
    id?: true
    userId?: true
    walletId?: true
    currencyCode?: true
    amount?: true
    fee?: true
    netAmount?: true
    exchangeRate?: true
    provider?: true
    providerTransactionId?: true
    providerReference?: true
    paymentMethod?: true
    country?: true
    countryCode?: true
    status?: true
    idempotencyKey?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    transactionId?: true
    _all?: true
  }

  export type DepositAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Deposit to aggregate.
     */
    where?: DepositWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Deposits to fetch.
     */
    orderBy?: DepositOrderByWithRelationInput | DepositOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DepositWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Deposits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Deposits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Deposits
    **/
    _count?: true | DepositCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DepositAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DepositSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DepositMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DepositMaxAggregateInputType
  }

  export type GetDepositAggregateType<T extends DepositAggregateArgs> = {
        [P in keyof T & keyof AggregateDeposit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDeposit[P]>
      : GetScalarType<T[P], AggregateDeposit[P]>
  }




  export type DepositGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepositWhereInput
    orderBy?: DepositOrderByWithAggregationInput | DepositOrderByWithAggregationInput[]
    by: DepositScalarFieldEnum[] | DepositScalarFieldEnum
    having?: DepositScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DepositCountAggregateInputType | true
    _avg?: DepositAvgAggregateInputType
    _sum?: DepositSumAggregateInputType
    _min?: DepositMinAggregateInputType
    _max?: DepositMaxAggregateInputType
  }

  export type DepositGroupByOutputType = {
    id: string
    userId: string
    walletId: string
    currencyCode: string
    amount: Decimal
    fee: Decimal
    netAmount: Decimal
    exchangeRate: Decimal | null
    provider: $Enums.PaymentProvider
    providerTransactionId: string | null
    providerReference: string | null
    paymentMethod: $Enums.PaymentMethod | null
    country: string | null
    countryCode: string | null
    status: $Enums.DepositStatus
    idempotencyKey: string | null
    metadata: JsonValue | null
    createdAt: Date
    updatedAt: Date
    transactionId: string | null
    _count: DepositCountAggregateOutputType | null
    _avg: DepositAvgAggregateOutputType | null
    _sum: DepositSumAggregateOutputType | null
    _min: DepositMinAggregateOutputType | null
    _max: DepositMaxAggregateOutputType | null
  }

  type GetDepositGroupByPayload<T extends DepositGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DepositGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DepositGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DepositGroupByOutputType[P]>
            : GetScalarType<T[P], DepositGroupByOutputType[P]>
        }
      >
    >


  export type DepositSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    walletId?: boolean
    currencyCode?: boolean
    amount?: boolean
    fee?: boolean
    netAmount?: boolean
    exchangeRate?: boolean
    provider?: boolean
    providerTransactionId?: boolean
    providerReference?: boolean
    paymentMethod?: boolean
    country?: boolean
    countryCode?: boolean
    status?: boolean
    idempotencyKey?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    transactionId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    currency?: boolean | CurrencyDefaultArgs<ExtArgs>
    transaction?: boolean | Deposit$transactionArgs<ExtArgs>
  }, ExtArgs["result"]["deposit"]>

  export type DepositSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    walletId?: boolean
    currencyCode?: boolean
    amount?: boolean
    fee?: boolean
    netAmount?: boolean
    exchangeRate?: boolean
    provider?: boolean
    providerTransactionId?: boolean
    providerReference?: boolean
    paymentMethod?: boolean
    country?: boolean
    countryCode?: boolean
    status?: boolean
    idempotencyKey?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    transactionId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    currency?: boolean | CurrencyDefaultArgs<ExtArgs>
    transaction?: boolean | Deposit$transactionArgs<ExtArgs>
  }, ExtArgs["result"]["deposit"]>

  export type DepositSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    walletId?: boolean
    currencyCode?: boolean
    amount?: boolean
    fee?: boolean
    netAmount?: boolean
    exchangeRate?: boolean
    provider?: boolean
    providerTransactionId?: boolean
    providerReference?: boolean
    paymentMethod?: boolean
    country?: boolean
    countryCode?: boolean
    status?: boolean
    idempotencyKey?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    transactionId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    currency?: boolean | CurrencyDefaultArgs<ExtArgs>
    transaction?: boolean | Deposit$transactionArgs<ExtArgs>
  }, ExtArgs["result"]["deposit"]>

  export type DepositSelectScalar = {
    id?: boolean
    userId?: boolean
    walletId?: boolean
    currencyCode?: boolean
    amount?: boolean
    fee?: boolean
    netAmount?: boolean
    exchangeRate?: boolean
    provider?: boolean
    providerTransactionId?: boolean
    providerReference?: boolean
    paymentMethod?: boolean
    country?: boolean
    countryCode?: boolean
    status?: boolean
    idempotencyKey?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    transactionId?: boolean
  }

  export type DepositOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "walletId" | "currencyCode" | "amount" | "fee" | "netAmount" | "exchangeRate" | "provider" | "providerTransactionId" | "providerReference" | "paymentMethod" | "country" | "countryCode" | "status" | "idempotencyKey" | "metadata" | "createdAt" | "updatedAt" | "transactionId", ExtArgs["result"]["deposit"]>
  export type DepositInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    currency?: boolean | CurrencyDefaultArgs<ExtArgs>
    transaction?: boolean | Deposit$transactionArgs<ExtArgs>
  }
  export type DepositIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    currency?: boolean | CurrencyDefaultArgs<ExtArgs>
    transaction?: boolean | Deposit$transactionArgs<ExtArgs>
  }
  export type DepositIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    currency?: boolean | CurrencyDefaultArgs<ExtArgs>
    transaction?: boolean | Deposit$transactionArgs<ExtArgs>
  }

  export type $DepositPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Deposit"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      wallet: Prisma.$WalletPayload<ExtArgs>
      currency: Prisma.$CurrencyPayload<ExtArgs>
      transaction: Prisma.$TransactionPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      walletId: string
      currencyCode: string
      amount: Prisma.Decimal
      fee: Prisma.Decimal
      netAmount: Prisma.Decimal
      exchangeRate: Prisma.Decimal | null
      provider: $Enums.PaymentProvider
      providerTransactionId: string | null
      providerReference: string | null
      paymentMethod: $Enums.PaymentMethod | null
      country: string | null
      countryCode: string | null
      status: $Enums.DepositStatus
      idempotencyKey: string | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
      transactionId: string | null
    }, ExtArgs["result"]["deposit"]>
    composites: {}
  }

  type DepositGetPayload<S extends boolean | null | undefined | DepositDefaultArgs> = $Result.GetResult<Prisma.$DepositPayload, S>

  type DepositCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DepositFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DepositCountAggregateInputType | true
    }

  export interface DepositDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Deposit'], meta: { name: 'Deposit' } }
    /**
     * Find zero or one Deposit that matches the filter.
     * @param {DepositFindUniqueArgs} args - Arguments to find a Deposit
     * @example
     * // Get one Deposit
     * const deposit = await prisma.deposit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DepositFindUniqueArgs>(args: SelectSubset<T, DepositFindUniqueArgs<ExtArgs>>): Prisma__DepositClient<$Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Deposit that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DepositFindUniqueOrThrowArgs} args - Arguments to find a Deposit
     * @example
     * // Get one Deposit
     * const deposit = await prisma.deposit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DepositFindUniqueOrThrowArgs>(args: SelectSubset<T, DepositFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DepositClient<$Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Deposit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepositFindFirstArgs} args - Arguments to find a Deposit
     * @example
     * // Get one Deposit
     * const deposit = await prisma.deposit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DepositFindFirstArgs>(args?: SelectSubset<T, DepositFindFirstArgs<ExtArgs>>): Prisma__DepositClient<$Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Deposit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepositFindFirstOrThrowArgs} args - Arguments to find a Deposit
     * @example
     * // Get one Deposit
     * const deposit = await prisma.deposit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DepositFindFirstOrThrowArgs>(args?: SelectSubset<T, DepositFindFirstOrThrowArgs<ExtArgs>>): Prisma__DepositClient<$Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Deposits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepositFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Deposits
     * const deposits = await prisma.deposit.findMany()
     * 
     * // Get first 10 Deposits
     * const deposits = await prisma.deposit.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const depositWithIdOnly = await prisma.deposit.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DepositFindManyArgs>(args?: SelectSubset<T, DepositFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Deposit.
     * @param {DepositCreateArgs} args - Arguments to create a Deposit.
     * @example
     * // Create one Deposit
     * const Deposit = await prisma.deposit.create({
     *   data: {
     *     // ... data to create a Deposit
     *   }
     * })
     * 
     */
    create<T extends DepositCreateArgs>(args: SelectSubset<T, DepositCreateArgs<ExtArgs>>): Prisma__DepositClient<$Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Deposits.
     * @param {DepositCreateManyArgs} args - Arguments to create many Deposits.
     * @example
     * // Create many Deposits
     * const deposit = await prisma.deposit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DepositCreateManyArgs>(args?: SelectSubset<T, DepositCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Deposits and returns the data saved in the database.
     * @param {DepositCreateManyAndReturnArgs} args - Arguments to create many Deposits.
     * @example
     * // Create many Deposits
     * const deposit = await prisma.deposit.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Deposits and only return the `id`
     * const depositWithIdOnly = await prisma.deposit.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DepositCreateManyAndReturnArgs>(args?: SelectSubset<T, DepositCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Deposit.
     * @param {DepositDeleteArgs} args - Arguments to delete one Deposit.
     * @example
     * // Delete one Deposit
     * const Deposit = await prisma.deposit.delete({
     *   where: {
     *     // ... filter to delete one Deposit
     *   }
     * })
     * 
     */
    delete<T extends DepositDeleteArgs>(args: SelectSubset<T, DepositDeleteArgs<ExtArgs>>): Prisma__DepositClient<$Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Deposit.
     * @param {DepositUpdateArgs} args - Arguments to update one Deposit.
     * @example
     * // Update one Deposit
     * const deposit = await prisma.deposit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DepositUpdateArgs>(args: SelectSubset<T, DepositUpdateArgs<ExtArgs>>): Prisma__DepositClient<$Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Deposits.
     * @param {DepositDeleteManyArgs} args - Arguments to filter Deposits to delete.
     * @example
     * // Delete a few Deposits
     * const { count } = await prisma.deposit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DepositDeleteManyArgs>(args?: SelectSubset<T, DepositDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Deposits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepositUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Deposits
     * const deposit = await prisma.deposit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DepositUpdateManyArgs>(args: SelectSubset<T, DepositUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Deposits and returns the data updated in the database.
     * @param {DepositUpdateManyAndReturnArgs} args - Arguments to update many Deposits.
     * @example
     * // Update many Deposits
     * const deposit = await prisma.deposit.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Deposits and only return the `id`
     * const depositWithIdOnly = await prisma.deposit.updateManyAndReturn({
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
    updateManyAndReturn<T extends DepositUpdateManyAndReturnArgs>(args: SelectSubset<T, DepositUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Deposit.
     * @param {DepositUpsertArgs} args - Arguments to update or create a Deposit.
     * @example
     * // Update or create a Deposit
     * const deposit = await prisma.deposit.upsert({
     *   create: {
     *     // ... data to create a Deposit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Deposit we want to update
     *   }
     * })
     */
    upsert<T extends DepositUpsertArgs>(args: SelectSubset<T, DepositUpsertArgs<ExtArgs>>): Prisma__DepositClient<$Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Deposits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepositCountArgs} args - Arguments to filter Deposits to count.
     * @example
     * // Count the number of Deposits
     * const count = await prisma.deposit.count({
     *   where: {
     *     // ... the filter for the Deposits we want to count
     *   }
     * })
    **/
    count<T extends DepositCountArgs>(
      args?: Subset<T, DepositCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DepositCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Deposit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepositAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DepositAggregateArgs>(args: Subset<T, DepositAggregateArgs>): Prisma.PrismaPromise<GetDepositAggregateType<T>>

    /**
     * Group by Deposit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepositGroupByArgs} args - Group by arguments.
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
      T extends DepositGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DepositGroupByArgs['orderBy'] }
        : { orderBy?: DepositGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DepositGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDepositGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Deposit model
   */
  readonly fields: DepositFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Deposit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DepositClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    wallet<T extends WalletDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WalletDefaultArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    currency<T extends CurrencyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CurrencyDefaultArgs<ExtArgs>>): Prisma__CurrencyClient<$Result.GetResult<Prisma.$CurrencyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    transaction<T extends Deposit$transactionArgs<ExtArgs> = {}>(args?: Subset<T, Deposit$transactionArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Deposit model
   */
  interface DepositFieldRefs {
    readonly id: FieldRef<"Deposit", 'String'>
    readonly userId: FieldRef<"Deposit", 'String'>
    readonly walletId: FieldRef<"Deposit", 'String'>
    readonly currencyCode: FieldRef<"Deposit", 'String'>
    readonly amount: FieldRef<"Deposit", 'Decimal'>
    readonly fee: FieldRef<"Deposit", 'Decimal'>
    readonly netAmount: FieldRef<"Deposit", 'Decimal'>
    readonly exchangeRate: FieldRef<"Deposit", 'Decimal'>
    readonly provider: FieldRef<"Deposit", 'PaymentProvider'>
    readonly providerTransactionId: FieldRef<"Deposit", 'String'>
    readonly providerReference: FieldRef<"Deposit", 'String'>
    readonly paymentMethod: FieldRef<"Deposit", 'PaymentMethod'>
    readonly country: FieldRef<"Deposit", 'String'>
    readonly countryCode: FieldRef<"Deposit", 'String'>
    readonly status: FieldRef<"Deposit", 'DepositStatus'>
    readonly idempotencyKey: FieldRef<"Deposit", 'String'>
    readonly metadata: FieldRef<"Deposit", 'Json'>
    readonly createdAt: FieldRef<"Deposit", 'DateTime'>
    readonly updatedAt: FieldRef<"Deposit", 'DateTime'>
    readonly transactionId: FieldRef<"Deposit", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Deposit findUnique
   */
  export type DepositFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposit
     */
    select?: DepositSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deposit
     */
    omit?: DepositOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositInclude<ExtArgs> | null
    /**
     * Filter, which Deposit to fetch.
     */
    where: DepositWhereUniqueInput
  }

  /**
   * Deposit findUniqueOrThrow
   */
  export type DepositFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposit
     */
    select?: DepositSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deposit
     */
    omit?: DepositOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositInclude<ExtArgs> | null
    /**
     * Filter, which Deposit to fetch.
     */
    where: DepositWhereUniqueInput
  }

  /**
   * Deposit findFirst
   */
  export type DepositFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposit
     */
    select?: DepositSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deposit
     */
    omit?: DepositOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositInclude<ExtArgs> | null
    /**
     * Filter, which Deposit to fetch.
     */
    where?: DepositWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Deposits to fetch.
     */
    orderBy?: DepositOrderByWithRelationInput | DepositOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Deposits.
     */
    cursor?: DepositWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Deposits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Deposits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Deposits.
     */
    distinct?: DepositScalarFieldEnum | DepositScalarFieldEnum[]
  }

  /**
   * Deposit findFirstOrThrow
   */
  export type DepositFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposit
     */
    select?: DepositSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deposit
     */
    omit?: DepositOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositInclude<ExtArgs> | null
    /**
     * Filter, which Deposit to fetch.
     */
    where?: DepositWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Deposits to fetch.
     */
    orderBy?: DepositOrderByWithRelationInput | DepositOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Deposits.
     */
    cursor?: DepositWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Deposits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Deposits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Deposits.
     */
    distinct?: DepositScalarFieldEnum | DepositScalarFieldEnum[]
  }

  /**
   * Deposit findMany
   */
  export type DepositFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposit
     */
    select?: DepositSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deposit
     */
    omit?: DepositOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositInclude<ExtArgs> | null
    /**
     * Filter, which Deposits to fetch.
     */
    where?: DepositWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Deposits to fetch.
     */
    orderBy?: DepositOrderByWithRelationInput | DepositOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Deposits.
     */
    cursor?: DepositWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Deposits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Deposits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Deposits.
     */
    distinct?: DepositScalarFieldEnum | DepositScalarFieldEnum[]
  }

  /**
   * Deposit create
   */
  export type DepositCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposit
     */
    select?: DepositSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deposit
     */
    omit?: DepositOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositInclude<ExtArgs> | null
    /**
     * The data needed to create a Deposit.
     */
    data: XOR<DepositCreateInput, DepositUncheckedCreateInput>
  }

  /**
   * Deposit createMany
   */
  export type DepositCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Deposits.
     */
    data: DepositCreateManyInput | DepositCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Deposit createManyAndReturn
   */
  export type DepositCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposit
     */
    select?: DepositSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Deposit
     */
    omit?: DepositOmit<ExtArgs> | null
    /**
     * The data used to create many Deposits.
     */
    data: DepositCreateManyInput | DepositCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Deposit update
   */
  export type DepositUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposit
     */
    select?: DepositSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deposit
     */
    omit?: DepositOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositInclude<ExtArgs> | null
    /**
     * The data needed to update a Deposit.
     */
    data: XOR<DepositUpdateInput, DepositUncheckedUpdateInput>
    /**
     * Choose, which Deposit to update.
     */
    where: DepositWhereUniqueInput
  }

  /**
   * Deposit updateMany
   */
  export type DepositUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Deposits.
     */
    data: XOR<DepositUpdateManyMutationInput, DepositUncheckedUpdateManyInput>
    /**
     * Filter which Deposits to update
     */
    where?: DepositWhereInput
    /**
     * Limit how many Deposits to update.
     */
    limit?: number
  }

  /**
   * Deposit updateManyAndReturn
   */
  export type DepositUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposit
     */
    select?: DepositSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Deposit
     */
    omit?: DepositOmit<ExtArgs> | null
    /**
     * The data used to update Deposits.
     */
    data: XOR<DepositUpdateManyMutationInput, DepositUncheckedUpdateManyInput>
    /**
     * Filter which Deposits to update
     */
    where?: DepositWhereInput
    /**
     * Limit how many Deposits to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Deposit upsert
   */
  export type DepositUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposit
     */
    select?: DepositSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deposit
     */
    omit?: DepositOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositInclude<ExtArgs> | null
    /**
     * The filter to search for the Deposit to update in case it exists.
     */
    where: DepositWhereUniqueInput
    /**
     * In case the Deposit found by the `where` argument doesn't exist, create a new Deposit with this data.
     */
    create: XOR<DepositCreateInput, DepositUncheckedCreateInput>
    /**
     * In case the Deposit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DepositUpdateInput, DepositUncheckedUpdateInput>
  }

  /**
   * Deposit delete
   */
  export type DepositDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposit
     */
    select?: DepositSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deposit
     */
    omit?: DepositOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositInclude<ExtArgs> | null
    /**
     * Filter which Deposit to delete.
     */
    where: DepositWhereUniqueInput
  }

  /**
   * Deposit deleteMany
   */
  export type DepositDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Deposits to delete
     */
    where?: DepositWhereInput
    /**
     * Limit how many Deposits to delete.
     */
    limit?: number
  }

  /**
   * Deposit.transaction
   */
  export type Deposit$transactionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
  }

  /**
   * Deposit without action
   */
  export type DepositDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposit
     */
    select?: DepositSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deposit
     */
    omit?: DepositOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositInclude<ExtArgs> | null
  }


  /**
   * Model Transaction
   */

  export type AggregateTransaction = {
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  export type TransactionAvgAggregateOutputType = {
    amount: Decimal | null
    fee: Decimal | null
    netAmount: Decimal | null
  }

  export type TransactionSumAggregateOutputType = {
    amount: Decimal | null
    fee: Decimal | null
    netAmount: Decimal | null
  }

  export type TransactionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    walletId: string | null
    currencyCode: string | null
    type: $Enums.TransactionType | null
    amount: Decimal | null
    fee: Decimal | null
    netAmount: Decimal | null
    status: $Enums.TransactionStatus | null
    provider: $Enums.PaymentProvider | null
    providerTransactionId: string | null
    providerReference: string | null
    paymentMethod: $Enums.PaymentMethod | null
    reference: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TransactionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    walletId: string | null
    currencyCode: string | null
    type: $Enums.TransactionType | null
    amount: Decimal | null
    fee: Decimal | null
    netAmount: Decimal | null
    status: $Enums.TransactionStatus | null
    provider: $Enums.PaymentProvider | null
    providerTransactionId: string | null
    providerReference: string | null
    paymentMethod: $Enums.PaymentMethod | null
    reference: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TransactionCountAggregateOutputType = {
    id: number
    userId: number
    walletId: number
    currencyCode: number
    type: number
    amount: number
    fee: number
    netAmount: number
    status: number
    provider: number
    providerTransactionId: number
    providerReference: number
    paymentMethod: number
    reference: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TransactionAvgAggregateInputType = {
    amount?: true
    fee?: true
    netAmount?: true
  }

  export type TransactionSumAggregateInputType = {
    amount?: true
    fee?: true
    netAmount?: true
  }

  export type TransactionMinAggregateInputType = {
    id?: true
    userId?: true
    walletId?: true
    currencyCode?: true
    type?: true
    amount?: true
    fee?: true
    netAmount?: true
    status?: true
    provider?: true
    providerTransactionId?: true
    providerReference?: true
    paymentMethod?: true
    reference?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TransactionMaxAggregateInputType = {
    id?: true
    userId?: true
    walletId?: true
    currencyCode?: true
    type?: true
    amount?: true
    fee?: true
    netAmount?: true
    status?: true
    provider?: true
    providerTransactionId?: true
    providerReference?: true
    paymentMethod?: true
    reference?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TransactionCountAggregateInputType = {
    id?: true
    userId?: true
    walletId?: true
    currencyCode?: true
    type?: true
    amount?: true
    fee?: true
    netAmount?: true
    status?: true
    provider?: true
    providerTransactionId?: true
    providerReference?: true
    paymentMethod?: true
    reference?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transaction to aggregate.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transactions
    **/
    _count?: true | TransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransactionMaxAggregateInputType
  }

  export type GetTransactionAggregateType<T extends TransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransaction[P]>
      : GetScalarType<T[P], AggregateTransaction[P]>
  }




  export type TransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithAggregationInput | TransactionOrderByWithAggregationInput[]
    by: TransactionScalarFieldEnum[] | TransactionScalarFieldEnum
    having?: TransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransactionCountAggregateInputType | true
    _avg?: TransactionAvgAggregateInputType
    _sum?: TransactionSumAggregateInputType
    _min?: TransactionMinAggregateInputType
    _max?: TransactionMaxAggregateInputType
  }

  export type TransactionGroupByOutputType = {
    id: string
    userId: string
    walletId: string
    currencyCode: string
    type: $Enums.TransactionType
    amount: Decimal
    fee: Decimal
    netAmount: Decimal
    status: $Enums.TransactionStatus
    provider: $Enums.PaymentProvider | null
    providerTransactionId: string | null
    providerReference: string | null
    paymentMethod: $Enums.PaymentMethod | null
    reference: string
    metadata: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  type GetTransactionGroupByPayload<T extends TransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionGroupByOutputType[P]>
        }
      >
    >


  export type TransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    walletId?: boolean
    currencyCode?: boolean
    type?: boolean
    amount?: boolean
    fee?: boolean
    netAmount?: boolean
    status?: boolean
    provider?: boolean
    providerTransactionId?: boolean
    providerReference?: boolean
    paymentMethod?: boolean
    reference?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    currency?: boolean | CurrencyDefaultArgs<ExtArgs>
    deposit?: boolean | Transaction$depositArgs<ExtArgs>
    ledgerEntries?: boolean | Transaction$ledgerEntriesArgs<ExtArgs>
    _count?: boolean | TransactionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    walletId?: boolean
    currencyCode?: boolean
    type?: boolean
    amount?: boolean
    fee?: boolean
    netAmount?: boolean
    status?: boolean
    provider?: boolean
    providerTransactionId?: boolean
    providerReference?: boolean
    paymentMethod?: boolean
    reference?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    currency?: boolean | CurrencyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    walletId?: boolean
    currencyCode?: boolean
    type?: boolean
    amount?: boolean
    fee?: boolean
    netAmount?: boolean
    status?: boolean
    provider?: boolean
    providerTransactionId?: boolean
    providerReference?: boolean
    paymentMethod?: boolean
    reference?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    currency?: boolean | CurrencyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectScalar = {
    id?: boolean
    userId?: boolean
    walletId?: boolean
    currencyCode?: boolean
    type?: boolean
    amount?: boolean
    fee?: boolean
    netAmount?: boolean
    status?: boolean
    provider?: boolean
    providerTransactionId?: boolean
    providerReference?: boolean
    paymentMethod?: boolean
    reference?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TransactionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "walletId" | "currencyCode" | "type" | "amount" | "fee" | "netAmount" | "status" | "provider" | "providerTransactionId" | "providerReference" | "paymentMethod" | "reference" | "metadata" | "createdAt" | "updatedAt", ExtArgs["result"]["transaction"]>
  export type TransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    currency?: boolean | CurrencyDefaultArgs<ExtArgs>
    deposit?: boolean | Transaction$depositArgs<ExtArgs>
    ledgerEntries?: boolean | Transaction$ledgerEntriesArgs<ExtArgs>
    _count?: boolean | TransactionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TransactionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    currency?: boolean | CurrencyDefaultArgs<ExtArgs>
  }
  export type TransactionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    currency?: boolean | CurrencyDefaultArgs<ExtArgs>
  }

  export type $TransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transaction"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      wallet: Prisma.$WalletPayload<ExtArgs>
      currency: Prisma.$CurrencyPayload<ExtArgs>
      deposit: Prisma.$DepositPayload<ExtArgs> | null
      ledgerEntries: Prisma.$LedgerEntryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      walletId: string
      currencyCode: string
      type: $Enums.TransactionType
      amount: Prisma.Decimal
      fee: Prisma.Decimal
      netAmount: Prisma.Decimal
      status: $Enums.TransactionStatus
      provider: $Enums.PaymentProvider | null
      providerTransactionId: string | null
      providerReference: string | null
      paymentMethod: $Enums.PaymentMethod | null
      reference: string
      metadata: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["transaction"]>
    composites: {}
  }

  type TransactionGetPayload<S extends boolean | null | undefined | TransactionDefaultArgs> = $Result.GetResult<Prisma.$TransactionPayload, S>

  type TransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TransactionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TransactionCountAggregateInputType | true
    }

  export interface TransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Transaction'], meta: { name: 'Transaction' } }
    /**
     * Find zero or one Transaction that matches the filter.
     * @param {TransactionFindUniqueArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionFindUniqueArgs>(args: SelectSubset<T, TransactionFindUniqueArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Transaction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TransactionFindUniqueOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, TransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionFindFirstArgs>(args?: SelectSubset<T, TransactionFindFirstArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, TransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transactions
     * const transactions = await prisma.transaction.findMany()
     * 
     * // Get first 10 Transactions
     * const transactions = await prisma.transaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transactionWithIdOnly = await prisma.transaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TransactionFindManyArgs>(args?: SelectSubset<T, TransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Transaction.
     * @param {TransactionCreateArgs} args - Arguments to create a Transaction.
     * @example
     * // Create one Transaction
     * const Transaction = await prisma.transaction.create({
     *   data: {
     *     // ... data to create a Transaction
     *   }
     * })
     * 
     */
    create<T extends TransactionCreateArgs>(args: SelectSubset<T, TransactionCreateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Transactions.
     * @param {TransactionCreateManyArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransactionCreateManyArgs>(args?: SelectSubset<T, TransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Transactions and returns the data saved in the database.
     * @param {TransactionCreateManyAndReturnArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TransactionCreateManyAndReturnArgs>(args?: SelectSubset<T, TransactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Transaction.
     * @param {TransactionDeleteArgs} args - Arguments to delete one Transaction.
     * @example
     * // Delete one Transaction
     * const Transaction = await prisma.transaction.delete({
     *   where: {
     *     // ... filter to delete one Transaction
     *   }
     * })
     * 
     */
    delete<T extends TransactionDeleteArgs>(args: SelectSubset<T, TransactionDeleteArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Transaction.
     * @param {TransactionUpdateArgs} args - Arguments to update one Transaction.
     * @example
     * // Update one Transaction
     * const transaction = await prisma.transaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransactionUpdateArgs>(args: SelectSubset<T, TransactionUpdateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Transactions.
     * @param {TransactionDeleteManyArgs} args - Arguments to filter Transactions to delete.
     * @example
     * // Delete a few Transactions
     * const { count } = await prisma.transaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransactionDeleteManyArgs>(args?: SelectSubset<T, TransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransactionUpdateManyArgs>(args: SelectSubset<T, TransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions and returns the data updated in the database.
     * @param {TransactionUpdateManyAndReturnArgs} args - Arguments to update many Transactions.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.updateManyAndReturn({
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
    updateManyAndReturn<T extends TransactionUpdateManyAndReturnArgs>(args: SelectSubset<T, TransactionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Transaction.
     * @param {TransactionUpsertArgs} args - Arguments to update or create a Transaction.
     * @example
     * // Update or create a Transaction
     * const transaction = await prisma.transaction.upsert({
     *   create: {
     *     // ... data to create a Transaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transaction we want to update
     *   }
     * })
     */
    upsert<T extends TransactionUpsertArgs>(args: SelectSubset<T, TransactionUpsertArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCountArgs} args - Arguments to filter Transactions to count.
     * @example
     * // Count the number of Transactions
     * const count = await prisma.transaction.count({
     *   where: {
     *     // ... the filter for the Transactions we want to count
     *   }
     * })
    **/
    count<T extends TransactionCountArgs>(
      args?: Subset<T, TransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TransactionAggregateArgs>(args: Subset<T, TransactionAggregateArgs>): Prisma.PrismaPromise<GetTransactionAggregateType<T>>

    /**
     * Group by Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionGroupByArgs} args - Group by arguments.
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
      T extends TransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionGroupByArgs['orderBy'] }
        : { orderBy?: TransactionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Transaction model
   */
  readonly fields: TransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    wallet<T extends WalletDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WalletDefaultArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    currency<T extends CurrencyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CurrencyDefaultArgs<ExtArgs>>): Prisma__CurrencyClient<$Result.GetResult<Prisma.$CurrencyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    deposit<T extends Transaction$depositArgs<ExtArgs> = {}>(args?: Subset<T, Transaction$depositArgs<ExtArgs>>): Prisma__DepositClient<$Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    ledgerEntries<T extends Transaction$ledgerEntriesArgs<ExtArgs> = {}>(args?: Subset<T, Transaction$ledgerEntriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Transaction model
   */
  interface TransactionFieldRefs {
    readonly id: FieldRef<"Transaction", 'String'>
    readonly userId: FieldRef<"Transaction", 'String'>
    readonly walletId: FieldRef<"Transaction", 'String'>
    readonly currencyCode: FieldRef<"Transaction", 'String'>
    readonly type: FieldRef<"Transaction", 'TransactionType'>
    readonly amount: FieldRef<"Transaction", 'Decimal'>
    readonly fee: FieldRef<"Transaction", 'Decimal'>
    readonly netAmount: FieldRef<"Transaction", 'Decimal'>
    readonly status: FieldRef<"Transaction", 'TransactionStatus'>
    readonly provider: FieldRef<"Transaction", 'PaymentProvider'>
    readonly providerTransactionId: FieldRef<"Transaction", 'String'>
    readonly providerReference: FieldRef<"Transaction", 'String'>
    readonly paymentMethod: FieldRef<"Transaction", 'PaymentMethod'>
    readonly reference: FieldRef<"Transaction", 'String'>
    readonly metadata: FieldRef<"Transaction", 'Json'>
    readonly createdAt: FieldRef<"Transaction", 'DateTime'>
    readonly updatedAt: FieldRef<"Transaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Transaction findUnique
   */
  export type TransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findUniqueOrThrow
   */
  export type TransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findFirst
   */
  export type TransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findFirstOrThrow
   */
  export type TransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findMany
   */
  export type TransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transactions to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction create
   */
  export type TransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a Transaction.
     */
    data: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
  }

  /**
   * Transaction createMany
   */
  export type TransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Transaction createManyAndReturn
   */
  export type TransactionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction update
   */
  export type TransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a Transaction.
     */
    data: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
    /**
     * Choose, which Transaction to update.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction updateMany
   */
  export type TransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
  }

  /**
   * Transaction updateManyAndReturn
   */
  export type TransactionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction upsert
   */
  export type TransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the Transaction to update in case it exists.
     */
    where: TransactionWhereUniqueInput
    /**
     * In case the Transaction found by the `where` argument doesn't exist, create a new Transaction with this data.
     */
    create: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
    /**
     * In case the Transaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
  }

  /**
   * Transaction delete
   */
  export type TransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter which Transaction to delete.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction deleteMany
   */
  export type TransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transactions to delete
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to delete.
     */
    limit?: number
  }

  /**
   * Transaction.deposit
   */
  export type Transaction$depositArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposit
     */
    select?: DepositSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deposit
     */
    omit?: DepositOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositInclude<ExtArgs> | null
    where?: DepositWhereInput
  }

  /**
   * Transaction.ledgerEntries
   */
  export type Transaction$ledgerEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryInclude<ExtArgs> | null
    where?: LedgerEntryWhereInput
    orderBy?: LedgerEntryOrderByWithRelationInput | LedgerEntryOrderByWithRelationInput[]
    cursor?: LedgerEntryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LedgerEntryScalarFieldEnum | LedgerEntryScalarFieldEnum[]
  }

  /**
   * Transaction without action
   */
  export type TransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
  }


  /**
   * Model LedgerEntry
   */

  export type AggregateLedgerEntry = {
    _count: LedgerEntryCountAggregateOutputType | null
    _avg: LedgerEntryAvgAggregateOutputType | null
    _sum: LedgerEntrySumAggregateOutputType | null
    _min: LedgerEntryMinAggregateOutputType | null
    _max: LedgerEntryMaxAggregateOutputType | null
  }

  export type LedgerEntryAvgAggregateOutputType = {
    amount: Decimal | null
    balanceBefore: Decimal | null
    balanceAfter: Decimal | null
  }

  export type LedgerEntrySumAggregateOutputType = {
    amount: Decimal | null
    balanceBefore: Decimal | null
    balanceAfter: Decimal | null
  }

  export type LedgerEntryMinAggregateOutputType = {
    id: string | null
    walletId: string | null
    currencyCode: string | null
    transactionId: string | null
    type: $Enums.LedgerEntryType | null
    amount: Decimal | null
    balanceBefore: Decimal | null
    balanceAfter: Decimal | null
    reference: string | null
    reason: string | null
    createdAt: Date | null
  }

  export type LedgerEntryMaxAggregateOutputType = {
    id: string | null
    walletId: string | null
    currencyCode: string | null
    transactionId: string | null
    type: $Enums.LedgerEntryType | null
    amount: Decimal | null
    balanceBefore: Decimal | null
    balanceAfter: Decimal | null
    reference: string | null
    reason: string | null
    createdAt: Date | null
  }

  export type LedgerEntryCountAggregateOutputType = {
    id: number
    walletId: number
    currencyCode: number
    transactionId: number
    type: number
    amount: number
    balanceBefore: number
    balanceAfter: number
    reference: number
    reason: number
    createdAt: number
    _all: number
  }


  export type LedgerEntryAvgAggregateInputType = {
    amount?: true
    balanceBefore?: true
    balanceAfter?: true
  }

  export type LedgerEntrySumAggregateInputType = {
    amount?: true
    balanceBefore?: true
    balanceAfter?: true
  }

  export type LedgerEntryMinAggregateInputType = {
    id?: true
    walletId?: true
    currencyCode?: true
    transactionId?: true
    type?: true
    amount?: true
    balanceBefore?: true
    balanceAfter?: true
    reference?: true
    reason?: true
    createdAt?: true
  }

  export type LedgerEntryMaxAggregateInputType = {
    id?: true
    walletId?: true
    currencyCode?: true
    transactionId?: true
    type?: true
    amount?: true
    balanceBefore?: true
    balanceAfter?: true
    reference?: true
    reason?: true
    createdAt?: true
  }

  export type LedgerEntryCountAggregateInputType = {
    id?: true
    walletId?: true
    currencyCode?: true
    transactionId?: true
    type?: true
    amount?: true
    balanceBefore?: true
    balanceAfter?: true
    reference?: true
    reason?: true
    createdAt?: true
    _all?: true
  }

  export type LedgerEntryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LedgerEntry to aggregate.
     */
    where?: LedgerEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LedgerEntries to fetch.
     */
    orderBy?: LedgerEntryOrderByWithRelationInput | LedgerEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LedgerEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LedgerEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LedgerEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LedgerEntries
    **/
    _count?: true | LedgerEntryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LedgerEntryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LedgerEntrySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LedgerEntryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LedgerEntryMaxAggregateInputType
  }

  export type GetLedgerEntryAggregateType<T extends LedgerEntryAggregateArgs> = {
        [P in keyof T & keyof AggregateLedgerEntry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLedgerEntry[P]>
      : GetScalarType<T[P], AggregateLedgerEntry[P]>
  }




  export type LedgerEntryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LedgerEntryWhereInput
    orderBy?: LedgerEntryOrderByWithAggregationInput | LedgerEntryOrderByWithAggregationInput[]
    by: LedgerEntryScalarFieldEnum[] | LedgerEntryScalarFieldEnum
    having?: LedgerEntryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LedgerEntryCountAggregateInputType | true
    _avg?: LedgerEntryAvgAggregateInputType
    _sum?: LedgerEntrySumAggregateInputType
    _min?: LedgerEntryMinAggregateInputType
    _max?: LedgerEntryMaxAggregateInputType
  }

  export type LedgerEntryGroupByOutputType = {
    id: string
    walletId: string
    currencyCode: string
    transactionId: string | null
    type: $Enums.LedgerEntryType
    amount: Decimal
    balanceBefore: Decimal
    balanceAfter: Decimal
    reference: string | null
    reason: string | null
    createdAt: Date
    _count: LedgerEntryCountAggregateOutputType | null
    _avg: LedgerEntryAvgAggregateOutputType | null
    _sum: LedgerEntrySumAggregateOutputType | null
    _min: LedgerEntryMinAggregateOutputType | null
    _max: LedgerEntryMaxAggregateOutputType | null
  }

  type GetLedgerEntryGroupByPayload<T extends LedgerEntryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LedgerEntryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LedgerEntryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LedgerEntryGroupByOutputType[P]>
            : GetScalarType<T[P], LedgerEntryGroupByOutputType[P]>
        }
      >
    >


  export type LedgerEntrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    walletId?: boolean
    currencyCode?: boolean
    transactionId?: boolean
    type?: boolean
    amount?: boolean
    balanceBefore?: boolean
    balanceAfter?: boolean
    reference?: boolean
    reason?: boolean
    createdAt?: boolean
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    currency?: boolean | CurrencyDefaultArgs<ExtArgs>
    transaction?: boolean | LedgerEntry$transactionArgs<ExtArgs>
  }, ExtArgs["result"]["ledgerEntry"]>

  export type LedgerEntrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    walletId?: boolean
    currencyCode?: boolean
    transactionId?: boolean
    type?: boolean
    amount?: boolean
    balanceBefore?: boolean
    balanceAfter?: boolean
    reference?: boolean
    reason?: boolean
    createdAt?: boolean
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    currency?: boolean | CurrencyDefaultArgs<ExtArgs>
    transaction?: boolean | LedgerEntry$transactionArgs<ExtArgs>
  }, ExtArgs["result"]["ledgerEntry"]>

  export type LedgerEntrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    walletId?: boolean
    currencyCode?: boolean
    transactionId?: boolean
    type?: boolean
    amount?: boolean
    balanceBefore?: boolean
    balanceAfter?: boolean
    reference?: boolean
    reason?: boolean
    createdAt?: boolean
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    currency?: boolean | CurrencyDefaultArgs<ExtArgs>
    transaction?: boolean | LedgerEntry$transactionArgs<ExtArgs>
  }, ExtArgs["result"]["ledgerEntry"]>

  export type LedgerEntrySelectScalar = {
    id?: boolean
    walletId?: boolean
    currencyCode?: boolean
    transactionId?: boolean
    type?: boolean
    amount?: boolean
    balanceBefore?: boolean
    balanceAfter?: boolean
    reference?: boolean
    reason?: boolean
    createdAt?: boolean
  }

  export type LedgerEntryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "walletId" | "currencyCode" | "transactionId" | "type" | "amount" | "balanceBefore" | "balanceAfter" | "reference" | "reason" | "createdAt", ExtArgs["result"]["ledgerEntry"]>
  export type LedgerEntryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    currency?: boolean | CurrencyDefaultArgs<ExtArgs>
    transaction?: boolean | LedgerEntry$transactionArgs<ExtArgs>
  }
  export type LedgerEntryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    currency?: boolean | CurrencyDefaultArgs<ExtArgs>
    transaction?: boolean | LedgerEntry$transactionArgs<ExtArgs>
  }
  export type LedgerEntryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    currency?: boolean | CurrencyDefaultArgs<ExtArgs>
    transaction?: boolean | LedgerEntry$transactionArgs<ExtArgs>
  }

  export type $LedgerEntryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LedgerEntry"
    objects: {
      wallet: Prisma.$WalletPayload<ExtArgs>
      currency: Prisma.$CurrencyPayload<ExtArgs>
      transaction: Prisma.$TransactionPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      walletId: string
      currencyCode: string
      transactionId: string | null
      type: $Enums.LedgerEntryType
      amount: Prisma.Decimal
      balanceBefore: Prisma.Decimal
      balanceAfter: Prisma.Decimal
      reference: string | null
      reason: string | null
      createdAt: Date
    }, ExtArgs["result"]["ledgerEntry"]>
    composites: {}
  }

  type LedgerEntryGetPayload<S extends boolean | null | undefined | LedgerEntryDefaultArgs> = $Result.GetResult<Prisma.$LedgerEntryPayload, S>

  type LedgerEntryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LedgerEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LedgerEntryCountAggregateInputType | true
    }

  export interface LedgerEntryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LedgerEntry'], meta: { name: 'LedgerEntry' } }
    /**
     * Find zero or one LedgerEntry that matches the filter.
     * @param {LedgerEntryFindUniqueArgs} args - Arguments to find a LedgerEntry
     * @example
     * // Get one LedgerEntry
     * const ledgerEntry = await prisma.ledgerEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LedgerEntryFindUniqueArgs>(args: SelectSubset<T, LedgerEntryFindUniqueArgs<ExtArgs>>): Prisma__LedgerEntryClient<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LedgerEntry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LedgerEntryFindUniqueOrThrowArgs} args - Arguments to find a LedgerEntry
     * @example
     * // Get one LedgerEntry
     * const ledgerEntry = await prisma.ledgerEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LedgerEntryFindUniqueOrThrowArgs>(args: SelectSubset<T, LedgerEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LedgerEntryClient<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LedgerEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerEntryFindFirstArgs} args - Arguments to find a LedgerEntry
     * @example
     * // Get one LedgerEntry
     * const ledgerEntry = await prisma.ledgerEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LedgerEntryFindFirstArgs>(args?: SelectSubset<T, LedgerEntryFindFirstArgs<ExtArgs>>): Prisma__LedgerEntryClient<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LedgerEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerEntryFindFirstOrThrowArgs} args - Arguments to find a LedgerEntry
     * @example
     * // Get one LedgerEntry
     * const ledgerEntry = await prisma.ledgerEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LedgerEntryFindFirstOrThrowArgs>(args?: SelectSubset<T, LedgerEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma__LedgerEntryClient<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LedgerEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LedgerEntries
     * const ledgerEntries = await prisma.ledgerEntry.findMany()
     * 
     * // Get first 10 LedgerEntries
     * const ledgerEntries = await prisma.ledgerEntry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ledgerEntryWithIdOnly = await prisma.ledgerEntry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LedgerEntryFindManyArgs>(args?: SelectSubset<T, LedgerEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LedgerEntry.
     * @param {LedgerEntryCreateArgs} args - Arguments to create a LedgerEntry.
     * @example
     * // Create one LedgerEntry
     * const LedgerEntry = await prisma.ledgerEntry.create({
     *   data: {
     *     // ... data to create a LedgerEntry
     *   }
     * })
     * 
     */
    create<T extends LedgerEntryCreateArgs>(args: SelectSubset<T, LedgerEntryCreateArgs<ExtArgs>>): Prisma__LedgerEntryClient<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LedgerEntries.
     * @param {LedgerEntryCreateManyArgs} args - Arguments to create many LedgerEntries.
     * @example
     * // Create many LedgerEntries
     * const ledgerEntry = await prisma.ledgerEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LedgerEntryCreateManyArgs>(args?: SelectSubset<T, LedgerEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LedgerEntries and returns the data saved in the database.
     * @param {LedgerEntryCreateManyAndReturnArgs} args - Arguments to create many LedgerEntries.
     * @example
     * // Create many LedgerEntries
     * const ledgerEntry = await prisma.ledgerEntry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LedgerEntries and only return the `id`
     * const ledgerEntryWithIdOnly = await prisma.ledgerEntry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LedgerEntryCreateManyAndReturnArgs>(args?: SelectSubset<T, LedgerEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LedgerEntry.
     * @param {LedgerEntryDeleteArgs} args - Arguments to delete one LedgerEntry.
     * @example
     * // Delete one LedgerEntry
     * const LedgerEntry = await prisma.ledgerEntry.delete({
     *   where: {
     *     // ... filter to delete one LedgerEntry
     *   }
     * })
     * 
     */
    delete<T extends LedgerEntryDeleteArgs>(args: SelectSubset<T, LedgerEntryDeleteArgs<ExtArgs>>): Prisma__LedgerEntryClient<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LedgerEntry.
     * @param {LedgerEntryUpdateArgs} args - Arguments to update one LedgerEntry.
     * @example
     * // Update one LedgerEntry
     * const ledgerEntry = await prisma.ledgerEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LedgerEntryUpdateArgs>(args: SelectSubset<T, LedgerEntryUpdateArgs<ExtArgs>>): Prisma__LedgerEntryClient<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LedgerEntries.
     * @param {LedgerEntryDeleteManyArgs} args - Arguments to filter LedgerEntries to delete.
     * @example
     * // Delete a few LedgerEntries
     * const { count } = await prisma.ledgerEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LedgerEntryDeleteManyArgs>(args?: SelectSubset<T, LedgerEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LedgerEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LedgerEntries
     * const ledgerEntry = await prisma.ledgerEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LedgerEntryUpdateManyArgs>(args: SelectSubset<T, LedgerEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LedgerEntries and returns the data updated in the database.
     * @param {LedgerEntryUpdateManyAndReturnArgs} args - Arguments to update many LedgerEntries.
     * @example
     * // Update many LedgerEntries
     * const ledgerEntry = await prisma.ledgerEntry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LedgerEntries and only return the `id`
     * const ledgerEntryWithIdOnly = await prisma.ledgerEntry.updateManyAndReturn({
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
    updateManyAndReturn<T extends LedgerEntryUpdateManyAndReturnArgs>(args: SelectSubset<T, LedgerEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LedgerEntry.
     * @param {LedgerEntryUpsertArgs} args - Arguments to update or create a LedgerEntry.
     * @example
     * // Update or create a LedgerEntry
     * const ledgerEntry = await prisma.ledgerEntry.upsert({
     *   create: {
     *     // ... data to create a LedgerEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LedgerEntry we want to update
     *   }
     * })
     */
    upsert<T extends LedgerEntryUpsertArgs>(args: SelectSubset<T, LedgerEntryUpsertArgs<ExtArgs>>): Prisma__LedgerEntryClient<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LedgerEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerEntryCountArgs} args - Arguments to filter LedgerEntries to count.
     * @example
     * // Count the number of LedgerEntries
     * const count = await prisma.ledgerEntry.count({
     *   where: {
     *     // ... the filter for the LedgerEntries we want to count
     *   }
     * })
    **/
    count<T extends LedgerEntryCountArgs>(
      args?: Subset<T, LedgerEntryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LedgerEntryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LedgerEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LedgerEntryAggregateArgs>(args: Subset<T, LedgerEntryAggregateArgs>): Prisma.PrismaPromise<GetLedgerEntryAggregateType<T>>

    /**
     * Group by LedgerEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerEntryGroupByArgs} args - Group by arguments.
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
      T extends LedgerEntryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LedgerEntryGroupByArgs['orderBy'] }
        : { orderBy?: LedgerEntryGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, LedgerEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLedgerEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LedgerEntry model
   */
  readonly fields: LedgerEntryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LedgerEntry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LedgerEntryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    wallet<T extends WalletDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WalletDefaultArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    currency<T extends CurrencyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CurrencyDefaultArgs<ExtArgs>>): Prisma__CurrencyClient<$Result.GetResult<Prisma.$CurrencyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    transaction<T extends LedgerEntry$transactionArgs<ExtArgs> = {}>(args?: Subset<T, LedgerEntry$transactionArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the LedgerEntry model
   */
  interface LedgerEntryFieldRefs {
    readonly id: FieldRef<"LedgerEntry", 'String'>
    readonly walletId: FieldRef<"LedgerEntry", 'String'>
    readonly currencyCode: FieldRef<"LedgerEntry", 'String'>
    readonly transactionId: FieldRef<"LedgerEntry", 'String'>
    readonly type: FieldRef<"LedgerEntry", 'LedgerEntryType'>
    readonly amount: FieldRef<"LedgerEntry", 'Decimal'>
    readonly balanceBefore: FieldRef<"LedgerEntry", 'Decimal'>
    readonly balanceAfter: FieldRef<"LedgerEntry", 'Decimal'>
    readonly reference: FieldRef<"LedgerEntry", 'String'>
    readonly reason: FieldRef<"LedgerEntry", 'String'>
    readonly createdAt: FieldRef<"LedgerEntry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LedgerEntry findUnique
   */
  export type LedgerEntryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryInclude<ExtArgs> | null
    /**
     * Filter, which LedgerEntry to fetch.
     */
    where: LedgerEntryWhereUniqueInput
  }

  /**
   * LedgerEntry findUniqueOrThrow
   */
  export type LedgerEntryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryInclude<ExtArgs> | null
    /**
     * Filter, which LedgerEntry to fetch.
     */
    where: LedgerEntryWhereUniqueInput
  }

  /**
   * LedgerEntry findFirst
   */
  export type LedgerEntryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryInclude<ExtArgs> | null
    /**
     * Filter, which LedgerEntry to fetch.
     */
    where?: LedgerEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LedgerEntries to fetch.
     */
    orderBy?: LedgerEntryOrderByWithRelationInput | LedgerEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LedgerEntries.
     */
    cursor?: LedgerEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LedgerEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LedgerEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LedgerEntries.
     */
    distinct?: LedgerEntryScalarFieldEnum | LedgerEntryScalarFieldEnum[]
  }

  /**
   * LedgerEntry findFirstOrThrow
   */
  export type LedgerEntryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryInclude<ExtArgs> | null
    /**
     * Filter, which LedgerEntry to fetch.
     */
    where?: LedgerEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LedgerEntries to fetch.
     */
    orderBy?: LedgerEntryOrderByWithRelationInput | LedgerEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LedgerEntries.
     */
    cursor?: LedgerEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LedgerEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LedgerEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LedgerEntries.
     */
    distinct?: LedgerEntryScalarFieldEnum | LedgerEntryScalarFieldEnum[]
  }

  /**
   * LedgerEntry findMany
   */
  export type LedgerEntryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryInclude<ExtArgs> | null
    /**
     * Filter, which LedgerEntries to fetch.
     */
    where?: LedgerEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LedgerEntries to fetch.
     */
    orderBy?: LedgerEntryOrderByWithRelationInput | LedgerEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LedgerEntries.
     */
    cursor?: LedgerEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LedgerEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LedgerEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LedgerEntries.
     */
    distinct?: LedgerEntryScalarFieldEnum | LedgerEntryScalarFieldEnum[]
  }

  /**
   * LedgerEntry create
   */
  export type LedgerEntryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryInclude<ExtArgs> | null
    /**
     * The data needed to create a LedgerEntry.
     */
    data: XOR<LedgerEntryCreateInput, LedgerEntryUncheckedCreateInput>
  }

  /**
   * LedgerEntry createMany
   */
  export type LedgerEntryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LedgerEntries.
     */
    data: LedgerEntryCreateManyInput | LedgerEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LedgerEntry createManyAndReturn
   */
  export type LedgerEntryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * The data used to create many LedgerEntries.
     */
    data: LedgerEntryCreateManyInput | LedgerEntryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LedgerEntry update
   */
  export type LedgerEntryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryInclude<ExtArgs> | null
    /**
     * The data needed to update a LedgerEntry.
     */
    data: XOR<LedgerEntryUpdateInput, LedgerEntryUncheckedUpdateInput>
    /**
     * Choose, which LedgerEntry to update.
     */
    where: LedgerEntryWhereUniqueInput
  }

  /**
   * LedgerEntry updateMany
   */
  export type LedgerEntryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LedgerEntries.
     */
    data: XOR<LedgerEntryUpdateManyMutationInput, LedgerEntryUncheckedUpdateManyInput>
    /**
     * Filter which LedgerEntries to update
     */
    where?: LedgerEntryWhereInput
    /**
     * Limit how many LedgerEntries to update.
     */
    limit?: number
  }

  /**
   * LedgerEntry updateManyAndReturn
   */
  export type LedgerEntryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * The data used to update LedgerEntries.
     */
    data: XOR<LedgerEntryUpdateManyMutationInput, LedgerEntryUncheckedUpdateManyInput>
    /**
     * Filter which LedgerEntries to update
     */
    where?: LedgerEntryWhereInput
    /**
     * Limit how many LedgerEntries to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LedgerEntry upsert
   */
  export type LedgerEntryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryInclude<ExtArgs> | null
    /**
     * The filter to search for the LedgerEntry to update in case it exists.
     */
    where: LedgerEntryWhereUniqueInput
    /**
     * In case the LedgerEntry found by the `where` argument doesn't exist, create a new LedgerEntry with this data.
     */
    create: XOR<LedgerEntryCreateInput, LedgerEntryUncheckedCreateInput>
    /**
     * In case the LedgerEntry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LedgerEntryUpdateInput, LedgerEntryUncheckedUpdateInput>
  }

  /**
   * LedgerEntry delete
   */
  export type LedgerEntryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryInclude<ExtArgs> | null
    /**
     * Filter which LedgerEntry to delete.
     */
    where: LedgerEntryWhereUniqueInput
  }

  /**
   * LedgerEntry deleteMany
   */
  export type LedgerEntryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LedgerEntries to delete
     */
    where?: LedgerEntryWhereInput
    /**
     * Limit how many LedgerEntries to delete.
     */
    limit?: number
  }

  /**
   * LedgerEntry.transaction
   */
  export type LedgerEntry$transactionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
  }

  /**
   * LedgerEntry without action
   */
  export type LedgerEntryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryInclude<ExtArgs> | null
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


  export const WalletScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WalletScalarFieldEnum = (typeof WalletScalarFieldEnum)[keyof typeof WalletScalarFieldEnum]


  export const CurrencyScalarFieldEnum: {
    code: 'code',
    name: 'name',
    symbol: 'symbol',
    country: 'country',
    region: 'region',
    flag: 'flag',
    enabled: 'enabled',
    depositEnabled: 'depositEnabled',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CurrencyScalarFieldEnum = (typeof CurrencyScalarFieldEnum)[keyof typeof CurrencyScalarFieldEnum]


  export const WalletBalanceScalarFieldEnum: {
    id: 'id',
    walletId: 'walletId',
    currencyCode: 'currencyCode',
    availableBalance: 'availableBalance',
    pendingBalance: 'pendingBalance',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WalletBalanceScalarFieldEnum = (typeof WalletBalanceScalarFieldEnum)[keyof typeof WalletBalanceScalarFieldEnum]


  export const DepositScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    walletId: 'walletId',
    currencyCode: 'currencyCode',
    amount: 'amount',
    fee: 'fee',
    netAmount: 'netAmount',
    exchangeRate: 'exchangeRate',
    provider: 'provider',
    providerTransactionId: 'providerTransactionId',
    providerReference: 'providerReference',
    paymentMethod: 'paymentMethod',
    country: 'country',
    countryCode: 'countryCode',
    status: 'status',
    idempotencyKey: 'idempotencyKey',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    transactionId: 'transactionId'
  };

  export type DepositScalarFieldEnum = (typeof DepositScalarFieldEnum)[keyof typeof DepositScalarFieldEnum]


  export const TransactionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    walletId: 'walletId',
    currencyCode: 'currencyCode',
    type: 'type',
    amount: 'amount',
    fee: 'fee',
    netAmount: 'netAmount',
    status: 'status',
    provider: 'provider',
    providerTransactionId: 'providerTransactionId',
    providerReference: 'providerReference',
    paymentMethod: 'paymentMethod',
    reference: 'reference',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TransactionScalarFieldEnum = (typeof TransactionScalarFieldEnum)[keyof typeof TransactionScalarFieldEnum]


  export const LedgerEntryScalarFieldEnum: {
    id: 'id',
    walletId: 'walletId',
    currencyCode: 'currencyCode',
    transactionId: 'transactionId',
    type: 'type',
    amount: 'amount',
    balanceBefore: 'balanceBefore',
    balanceAfter: 'balanceAfter',
    reference: 'reference',
    reason: 'reason',
    createdAt: 'createdAt'
  };

  export type LedgerEntryScalarFieldEnum = (typeof LedgerEntryScalarFieldEnum)[keyof typeof LedgerEntryScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


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


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


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
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'PaymentProvider'
   */
  export type EnumPaymentProviderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentProvider'>
    


  /**
   * Reference to a field of type 'PaymentProvider[]'
   */
  export type ListEnumPaymentProviderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentProvider[]'>
    


  /**
   * Reference to a field of type 'PaymentMethod'
   */
  export type EnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod'>
    


  /**
   * Reference to a field of type 'PaymentMethod[]'
   */
  export type ListEnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod[]'>
    


  /**
   * Reference to a field of type 'DepositStatus'
   */
  export type EnumDepositStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DepositStatus'>
    


  /**
   * Reference to a field of type 'DepositStatus[]'
   */
  export type ListEnumDepositStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DepositStatus[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'TransactionType'
   */
  export type EnumTransactionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionType'>
    


  /**
   * Reference to a field of type 'TransactionType[]'
   */
  export type ListEnumTransactionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionType[]'>
    


  /**
   * Reference to a field of type 'TransactionStatus'
   */
  export type EnumTransactionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionStatus'>
    


  /**
   * Reference to a field of type 'TransactionStatus[]'
   */
  export type ListEnumTransactionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionStatus[]'>
    


  /**
   * Reference to a field of type 'LedgerEntryType'
   */
  export type EnumLedgerEntryTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LedgerEntryType'>
    


  /**
   * Reference to a field of type 'LedgerEntryType[]'
   */
  export type ListEnumLedgerEntryTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LedgerEntryType[]'>
    


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
    wallet?: XOR<WalletNullableScalarRelationFilter, WalletWhereInput> | null
    deposits?: DepositListRelationFilter
    transactions?: TransactionListRelationFilter
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
    wallet?: WalletOrderByWithRelationInput
    deposits?: DepositOrderByRelationAggregateInput
    transactions?: TransactionOrderByRelationAggregateInput
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
    wallet?: XOR<WalletNullableScalarRelationFilter, WalletWhereInput> | null
    deposits?: DepositListRelationFilter
    transactions?: TransactionListRelationFilter
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

  export type WalletWhereInput = {
    AND?: WalletWhereInput | WalletWhereInput[]
    OR?: WalletWhereInput[]
    NOT?: WalletWhereInput | WalletWhereInput[]
    id?: StringFilter<"Wallet"> | string
    userId?: StringFilter<"Wallet"> | string
    createdAt?: DateTimeFilter<"Wallet"> | Date | string
    updatedAt?: DateTimeFilter<"Wallet"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    balances?: WalletBalanceListRelationFilter
    deposits?: DepositListRelationFilter
    transactions?: TransactionListRelationFilter
    ledgerEntries?: LedgerEntryListRelationFilter
  }

  export type WalletOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    balances?: WalletBalanceOrderByRelationAggregateInput
    deposits?: DepositOrderByRelationAggregateInput
    transactions?: TransactionOrderByRelationAggregateInput
    ledgerEntries?: LedgerEntryOrderByRelationAggregateInput
  }

  export type WalletWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: WalletWhereInput | WalletWhereInput[]
    OR?: WalletWhereInput[]
    NOT?: WalletWhereInput | WalletWhereInput[]
    createdAt?: DateTimeFilter<"Wallet"> | Date | string
    updatedAt?: DateTimeFilter<"Wallet"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    balances?: WalletBalanceListRelationFilter
    deposits?: DepositListRelationFilter
    transactions?: TransactionListRelationFilter
    ledgerEntries?: LedgerEntryListRelationFilter
  }, "id" | "userId">

  export type WalletOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WalletCountOrderByAggregateInput
    _max?: WalletMaxOrderByAggregateInput
    _min?: WalletMinOrderByAggregateInput
  }

  export type WalletScalarWhereWithAggregatesInput = {
    AND?: WalletScalarWhereWithAggregatesInput | WalletScalarWhereWithAggregatesInput[]
    OR?: WalletScalarWhereWithAggregatesInput[]
    NOT?: WalletScalarWhereWithAggregatesInput | WalletScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Wallet"> | string
    userId?: StringWithAggregatesFilter<"Wallet"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Wallet"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Wallet"> | Date | string
  }

  export type CurrencyWhereInput = {
    AND?: CurrencyWhereInput | CurrencyWhereInput[]
    OR?: CurrencyWhereInput[]
    NOT?: CurrencyWhereInput | CurrencyWhereInput[]
    code?: StringFilter<"Currency"> | string
    name?: StringFilter<"Currency"> | string
    symbol?: StringNullableFilter<"Currency"> | string | null
    country?: StringNullableFilter<"Currency"> | string | null
    region?: StringNullableFilter<"Currency"> | string | null
    flag?: StringNullableFilter<"Currency"> | string | null
    enabled?: BoolFilter<"Currency"> | boolean
    depositEnabled?: BoolFilter<"Currency"> | boolean
    createdAt?: DateTimeFilter<"Currency"> | Date | string
    updatedAt?: DateTimeFilter<"Currency"> | Date | string
    balances?: WalletBalanceListRelationFilter
    deposits?: DepositListRelationFilter
    transactions?: TransactionListRelationFilter
    ledgerEntries?: LedgerEntryListRelationFilter
  }

  export type CurrencyOrderByWithRelationInput = {
    code?: SortOrder
    name?: SortOrder
    symbol?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    flag?: SortOrderInput | SortOrder
    enabled?: SortOrder
    depositEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    balances?: WalletBalanceOrderByRelationAggregateInput
    deposits?: DepositOrderByRelationAggregateInput
    transactions?: TransactionOrderByRelationAggregateInput
    ledgerEntries?: LedgerEntryOrderByRelationAggregateInput
  }

  export type CurrencyWhereUniqueInput = Prisma.AtLeast<{
    code?: string
    AND?: CurrencyWhereInput | CurrencyWhereInput[]
    OR?: CurrencyWhereInput[]
    NOT?: CurrencyWhereInput | CurrencyWhereInput[]
    name?: StringFilter<"Currency"> | string
    symbol?: StringNullableFilter<"Currency"> | string | null
    country?: StringNullableFilter<"Currency"> | string | null
    region?: StringNullableFilter<"Currency"> | string | null
    flag?: StringNullableFilter<"Currency"> | string | null
    enabled?: BoolFilter<"Currency"> | boolean
    depositEnabled?: BoolFilter<"Currency"> | boolean
    createdAt?: DateTimeFilter<"Currency"> | Date | string
    updatedAt?: DateTimeFilter<"Currency"> | Date | string
    balances?: WalletBalanceListRelationFilter
    deposits?: DepositListRelationFilter
    transactions?: TransactionListRelationFilter
    ledgerEntries?: LedgerEntryListRelationFilter
  }, "code">

  export type CurrencyOrderByWithAggregationInput = {
    code?: SortOrder
    name?: SortOrder
    symbol?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    flag?: SortOrderInput | SortOrder
    enabled?: SortOrder
    depositEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CurrencyCountOrderByAggregateInput
    _max?: CurrencyMaxOrderByAggregateInput
    _min?: CurrencyMinOrderByAggregateInput
  }

  export type CurrencyScalarWhereWithAggregatesInput = {
    AND?: CurrencyScalarWhereWithAggregatesInput | CurrencyScalarWhereWithAggregatesInput[]
    OR?: CurrencyScalarWhereWithAggregatesInput[]
    NOT?: CurrencyScalarWhereWithAggregatesInput | CurrencyScalarWhereWithAggregatesInput[]
    code?: StringWithAggregatesFilter<"Currency"> | string
    name?: StringWithAggregatesFilter<"Currency"> | string
    symbol?: StringNullableWithAggregatesFilter<"Currency"> | string | null
    country?: StringNullableWithAggregatesFilter<"Currency"> | string | null
    region?: StringNullableWithAggregatesFilter<"Currency"> | string | null
    flag?: StringNullableWithAggregatesFilter<"Currency"> | string | null
    enabled?: BoolWithAggregatesFilter<"Currency"> | boolean
    depositEnabled?: BoolWithAggregatesFilter<"Currency"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Currency"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Currency"> | Date | string
  }

  export type WalletBalanceWhereInput = {
    AND?: WalletBalanceWhereInput | WalletBalanceWhereInput[]
    OR?: WalletBalanceWhereInput[]
    NOT?: WalletBalanceWhereInput | WalletBalanceWhereInput[]
    id?: StringFilter<"WalletBalance"> | string
    walletId?: StringFilter<"WalletBalance"> | string
    currencyCode?: StringFilter<"WalletBalance"> | string
    availableBalance?: DecimalFilter<"WalletBalance"> | Decimal | DecimalJsLike | number | string
    pendingBalance?: DecimalFilter<"WalletBalance"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"WalletBalance"> | Date | string
    updatedAt?: DateTimeFilter<"WalletBalance"> | Date | string
    wallet?: XOR<WalletScalarRelationFilter, WalletWhereInput>
    currency?: XOR<CurrencyScalarRelationFilter, CurrencyWhereInput>
  }

  export type WalletBalanceOrderByWithRelationInput = {
    id?: SortOrder
    walletId?: SortOrder
    currencyCode?: SortOrder
    availableBalance?: SortOrder
    pendingBalance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    wallet?: WalletOrderByWithRelationInput
    currency?: CurrencyOrderByWithRelationInput
  }

  export type WalletBalanceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    walletId_currencyCode?: WalletBalanceWalletIdCurrencyCodeCompoundUniqueInput
    AND?: WalletBalanceWhereInput | WalletBalanceWhereInput[]
    OR?: WalletBalanceWhereInput[]
    NOT?: WalletBalanceWhereInput | WalletBalanceWhereInput[]
    walletId?: StringFilter<"WalletBalance"> | string
    currencyCode?: StringFilter<"WalletBalance"> | string
    availableBalance?: DecimalFilter<"WalletBalance"> | Decimal | DecimalJsLike | number | string
    pendingBalance?: DecimalFilter<"WalletBalance"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"WalletBalance"> | Date | string
    updatedAt?: DateTimeFilter<"WalletBalance"> | Date | string
    wallet?: XOR<WalletScalarRelationFilter, WalletWhereInput>
    currency?: XOR<CurrencyScalarRelationFilter, CurrencyWhereInput>
  }, "id" | "walletId_currencyCode">

  export type WalletBalanceOrderByWithAggregationInput = {
    id?: SortOrder
    walletId?: SortOrder
    currencyCode?: SortOrder
    availableBalance?: SortOrder
    pendingBalance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WalletBalanceCountOrderByAggregateInput
    _avg?: WalletBalanceAvgOrderByAggregateInput
    _max?: WalletBalanceMaxOrderByAggregateInput
    _min?: WalletBalanceMinOrderByAggregateInput
    _sum?: WalletBalanceSumOrderByAggregateInput
  }

  export type WalletBalanceScalarWhereWithAggregatesInput = {
    AND?: WalletBalanceScalarWhereWithAggregatesInput | WalletBalanceScalarWhereWithAggregatesInput[]
    OR?: WalletBalanceScalarWhereWithAggregatesInput[]
    NOT?: WalletBalanceScalarWhereWithAggregatesInput | WalletBalanceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WalletBalance"> | string
    walletId?: StringWithAggregatesFilter<"WalletBalance"> | string
    currencyCode?: StringWithAggregatesFilter<"WalletBalance"> | string
    availableBalance?: DecimalWithAggregatesFilter<"WalletBalance"> | Decimal | DecimalJsLike | number | string
    pendingBalance?: DecimalWithAggregatesFilter<"WalletBalance"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeWithAggregatesFilter<"WalletBalance"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"WalletBalance"> | Date | string
  }

  export type DepositWhereInput = {
    AND?: DepositWhereInput | DepositWhereInput[]
    OR?: DepositWhereInput[]
    NOT?: DepositWhereInput | DepositWhereInput[]
    id?: StringFilter<"Deposit"> | string
    userId?: StringFilter<"Deposit"> | string
    walletId?: StringFilter<"Deposit"> | string
    currencyCode?: StringFilter<"Deposit"> | string
    amount?: DecimalFilter<"Deposit"> | Decimal | DecimalJsLike | number | string
    fee?: DecimalFilter<"Deposit"> | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFilter<"Deposit"> | Decimal | DecimalJsLike | number | string
    exchangeRate?: DecimalNullableFilter<"Deposit"> | Decimal | DecimalJsLike | number | string | null
    provider?: EnumPaymentProviderFilter<"Deposit"> | $Enums.PaymentProvider
    providerTransactionId?: StringNullableFilter<"Deposit"> | string | null
    providerReference?: StringNullableFilter<"Deposit"> | string | null
    paymentMethod?: EnumPaymentMethodNullableFilter<"Deposit"> | $Enums.PaymentMethod | null
    country?: StringNullableFilter<"Deposit"> | string | null
    countryCode?: StringNullableFilter<"Deposit"> | string | null
    status?: EnumDepositStatusFilter<"Deposit"> | $Enums.DepositStatus
    idempotencyKey?: StringNullableFilter<"Deposit"> | string | null
    metadata?: JsonNullableFilter<"Deposit">
    createdAt?: DateTimeFilter<"Deposit"> | Date | string
    updatedAt?: DateTimeFilter<"Deposit"> | Date | string
    transactionId?: StringNullableFilter<"Deposit"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    wallet?: XOR<WalletScalarRelationFilter, WalletWhereInput>
    currency?: XOR<CurrencyScalarRelationFilter, CurrencyWhereInput>
    transaction?: XOR<TransactionNullableScalarRelationFilter, TransactionWhereInput> | null
  }

  export type DepositOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    walletId?: SortOrder
    currencyCode?: SortOrder
    amount?: SortOrder
    fee?: SortOrder
    netAmount?: SortOrder
    exchangeRate?: SortOrderInput | SortOrder
    provider?: SortOrder
    providerTransactionId?: SortOrderInput | SortOrder
    providerReference?: SortOrderInput | SortOrder
    paymentMethod?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    countryCode?: SortOrderInput | SortOrder
    status?: SortOrder
    idempotencyKey?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    transactionId?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    wallet?: WalletOrderByWithRelationInput
    currency?: CurrencyOrderByWithRelationInput
    transaction?: TransactionOrderByWithRelationInput
  }

  export type DepositWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    transactionId?: string
    userId_idempotencyKey?: DepositUserIdIdempotencyKeyCompoundUniqueInput
    AND?: DepositWhereInput | DepositWhereInput[]
    OR?: DepositWhereInput[]
    NOT?: DepositWhereInput | DepositWhereInput[]
    userId?: StringFilter<"Deposit"> | string
    walletId?: StringFilter<"Deposit"> | string
    currencyCode?: StringFilter<"Deposit"> | string
    amount?: DecimalFilter<"Deposit"> | Decimal | DecimalJsLike | number | string
    fee?: DecimalFilter<"Deposit"> | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFilter<"Deposit"> | Decimal | DecimalJsLike | number | string
    exchangeRate?: DecimalNullableFilter<"Deposit"> | Decimal | DecimalJsLike | number | string | null
    provider?: EnumPaymentProviderFilter<"Deposit"> | $Enums.PaymentProvider
    providerTransactionId?: StringNullableFilter<"Deposit"> | string | null
    providerReference?: StringNullableFilter<"Deposit"> | string | null
    paymentMethod?: EnumPaymentMethodNullableFilter<"Deposit"> | $Enums.PaymentMethod | null
    country?: StringNullableFilter<"Deposit"> | string | null
    countryCode?: StringNullableFilter<"Deposit"> | string | null
    status?: EnumDepositStatusFilter<"Deposit"> | $Enums.DepositStatus
    idempotencyKey?: StringNullableFilter<"Deposit"> | string | null
    metadata?: JsonNullableFilter<"Deposit">
    createdAt?: DateTimeFilter<"Deposit"> | Date | string
    updatedAt?: DateTimeFilter<"Deposit"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    wallet?: XOR<WalletScalarRelationFilter, WalletWhereInput>
    currency?: XOR<CurrencyScalarRelationFilter, CurrencyWhereInput>
    transaction?: XOR<TransactionNullableScalarRelationFilter, TransactionWhereInput> | null
  }, "id" | "transactionId" | "userId_idempotencyKey">

  export type DepositOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    walletId?: SortOrder
    currencyCode?: SortOrder
    amount?: SortOrder
    fee?: SortOrder
    netAmount?: SortOrder
    exchangeRate?: SortOrderInput | SortOrder
    provider?: SortOrder
    providerTransactionId?: SortOrderInput | SortOrder
    providerReference?: SortOrderInput | SortOrder
    paymentMethod?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    countryCode?: SortOrderInput | SortOrder
    status?: SortOrder
    idempotencyKey?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    transactionId?: SortOrderInput | SortOrder
    _count?: DepositCountOrderByAggregateInput
    _avg?: DepositAvgOrderByAggregateInput
    _max?: DepositMaxOrderByAggregateInput
    _min?: DepositMinOrderByAggregateInput
    _sum?: DepositSumOrderByAggregateInput
  }

  export type DepositScalarWhereWithAggregatesInput = {
    AND?: DepositScalarWhereWithAggregatesInput | DepositScalarWhereWithAggregatesInput[]
    OR?: DepositScalarWhereWithAggregatesInput[]
    NOT?: DepositScalarWhereWithAggregatesInput | DepositScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Deposit"> | string
    userId?: StringWithAggregatesFilter<"Deposit"> | string
    walletId?: StringWithAggregatesFilter<"Deposit"> | string
    currencyCode?: StringWithAggregatesFilter<"Deposit"> | string
    amount?: DecimalWithAggregatesFilter<"Deposit"> | Decimal | DecimalJsLike | number | string
    fee?: DecimalWithAggregatesFilter<"Deposit"> | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalWithAggregatesFilter<"Deposit"> | Decimal | DecimalJsLike | number | string
    exchangeRate?: DecimalNullableWithAggregatesFilter<"Deposit"> | Decimal | DecimalJsLike | number | string | null
    provider?: EnumPaymentProviderWithAggregatesFilter<"Deposit"> | $Enums.PaymentProvider
    providerTransactionId?: StringNullableWithAggregatesFilter<"Deposit"> | string | null
    providerReference?: StringNullableWithAggregatesFilter<"Deposit"> | string | null
    paymentMethod?: EnumPaymentMethodNullableWithAggregatesFilter<"Deposit"> | $Enums.PaymentMethod | null
    country?: StringNullableWithAggregatesFilter<"Deposit"> | string | null
    countryCode?: StringNullableWithAggregatesFilter<"Deposit"> | string | null
    status?: EnumDepositStatusWithAggregatesFilter<"Deposit"> | $Enums.DepositStatus
    idempotencyKey?: StringNullableWithAggregatesFilter<"Deposit"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"Deposit">
    createdAt?: DateTimeWithAggregatesFilter<"Deposit"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Deposit"> | Date | string
    transactionId?: StringNullableWithAggregatesFilter<"Deposit"> | string | null
  }

  export type TransactionWhereInput = {
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    id?: StringFilter<"Transaction"> | string
    userId?: StringFilter<"Transaction"> | string
    walletId?: StringFilter<"Transaction"> | string
    currencyCode?: StringFilter<"Transaction"> | string
    type?: EnumTransactionTypeFilter<"Transaction"> | $Enums.TransactionType
    amount?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    fee?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    status?: EnumTransactionStatusFilter<"Transaction"> | $Enums.TransactionStatus
    provider?: EnumPaymentProviderNullableFilter<"Transaction"> | $Enums.PaymentProvider | null
    providerTransactionId?: StringNullableFilter<"Transaction"> | string | null
    providerReference?: StringNullableFilter<"Transaction"> | string | null
    paymentMethod?: EnumPaymentMethodNullableFilter<"Transaction"> | $Enums.PaymentMethod | null
    reference?: StringFilter<"Transaction"> | string
    metadata?: JsonNullableFilter<"Transaction">
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeFilter<"Transaction"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    wallet?: XOR<WalletScalarRelationFilter, WalletWhereInput>
    currency?: XOR<CurrencyScalarRelationFilter, CurrencyWhereInput>
    deposit?: XOR<DepositNullableScalarRelationFilter, DepositWhereInput> | null
    ledgerEntries?: LedgerEntryListRelationFilter
  }

  export type TransactionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    walletId?: SortOrder
    currencyCode?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    fee?: SortOrder
    netAmount?: SortOrder
    status?: SortOrder
    provider?: SortOrderInput | SortOrder
    providerTransactionId?: SortOrderInput | SortOrder
    providerReference?: SortOrderInput | SortOrder
    paymentMethod?: SortOrderInput | SortOrder
    reference?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    wallet?: WalletOrderByWithRelationInput
    currency?: CurrencyOrderByWithRelationInput
    deposit?: DepositOrderByWithRelationInput
    ledgerEntries?: LedgerEntryOrderByRelationAggregateInput
  }

  export type TransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    reference?: string
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    userId?: StringFilter<"Transaction"> | string
    walletId?: StringFilter<"Transaction"> | string
    currencyCode?: StringFilter<"Transaction"> | string
    type?: EnumTransactionTypeFilter<"Transaction"> | $Enums.TransactionType
    amount?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    fee?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    status?: EnumTransactionStatusFilter<"Transaction"> | $Enums.TransactionStatus
    provider?: EnumPaymentProviderNullableFilter<"Transaction"> | $Enums.PaymentProvider | null
    providerTransactionId?: StringNullableFilter<"Transaction"> | string | null
    providerReference?: StringNullableFilter<"Transaction"> | string | null
    paymentMethod?: EnumPaymentMethodNullableFilter<"Transaction"> | $Enums.PaymentMethod | null
    metadata?: JsonNullableFilter<"Transaction">
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeFilter<"Transaction"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    wallet?: XOR<WalletScalarRelationFilter, WalletWhereInput>
    currency?: XOR<CurrencyScalarRelationFilter, CurrencyWhereInput>
    deposit?: XOR<DepositNullableScalarRelationFilter, DepositWhereInput> | null
    ledgerEntries?: LedgerEntryListRelationFilter
  }, "id" | "reference">

  export type TransactionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    walletId?: SortOrder
    currencyCode?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    fee?: SortOrder
    netAmount?: SortOrder
    status?: SortOrder
    provider?: SortOrderInput | SortOrder
    providerTransactionId?: SortOrderInput | SortOrder
    providerReference?: SortOrderInput | SortOrder
    paymentMethod?: SortOrderInput | SortOrder
    reference?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TransactionCountOrderByAggregateInput
    _avg?: TransactionAvgOrderByAggregateInput
    _max?: TransactionMaxOrderByAggregateInput
    _min?: TransactionMinOrderByAggregateInput
    _sum?: TransactionSumOrderByAggregateInput
  }

  export type TransactionScalarWhereWithAggregatesInput = {
    AND?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    OR?: TransactionScalarWhereWithAggregatesInput[]
    NOT?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Transaction"> | string
    userId?: StringWithAggregatesFilter<"Transaction"> | string
    walletId?: StringWithAggregatesFilter<"Transaction"> | string
    currencyCode?: StringWithAggregatesFilter<"Transaction"> | string
    type?: EnumTransactionTypeWithAggregatesFilter<"Transaction"> | $Enums.TransactionType
    amount?: DecimalWithAggregatesFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    fee?: DecimalWithAggregatesFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalWithAggregatesFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    status?: EnumTransactionStatusWithAggregatesFilter<"Transaction"> | $Enums.TransactionStatus
    provider?: EnumPaymentProviderNullableWithAggregatesFilter<"Transaction"> | $Enums.PaymentProvider | null
    providerTransactionId?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    providerReference?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    paymentMethod?: EnumPaymentMethodNullableWithAggregatesFilter<"Transaction"> | $Enums.PaymentMethod | null
    reference?: StringWithAggregatesFilter<"Transaction"> | string
    metadata?: JsonNullableWithAggregatesFilter<"Transaction">
    createdAt?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
  }

  export type LedgerEntryWhereInput = {
    AND?: LedgerEntryWhereInput | LedgerEntryWhereInput[]
    OR?: LedgerEntryWhereInput[]
    NOT?: LedgerEntryWhereInput | LedgerEntryWhereInput[]
    id?: StringFilter<"LedgerEntry"> | string
    walletId?: StringFilter<"LedgerEntry"> | string
    currencyCode?: StringFilter<"LedgerEntry"> | string
    transactionId?: StringNullableFilter<"LedgerEntry"> | string | null
    type?: EnumLedgerEntryTypeFilter<"LedgerEntry"> | $Enums.LedgerEntryType
    amount?: DecimalFilter<"LedgerEntry"> | Decimal | DecimalJsLike | number | string
    balanceBefore?: DecimalFilter<"LedgerEntry"> | Decimal | DecimalJsLike | number | string
    balanceAfter?: DecimalFilter<"LedgerEntry"> | Decimal | DecimalJsLike | number | string
    reference?: StringNullableFilter<"LedgerEntry"> | string | null
    reason?: StringNullableFilter<"LedgerEntry"> | string | null
    createdAt?: DateTimeFilter<"LedgerEntry"> | Date | string
    wallet?: XOR<WalletScalarRelationFilter, WalletWhereInput>
    currency?: XOR<CurrencyScalarRelationFilter, CurrencyWhereInput>
    transaction?: XOR<TransactionNullableScalarRelationFilter, TransactionWhereInput> | null
  }

  export type LedgerEntryOrderByWithRelationInput = {
    id?: SortOrder
    walletId?: SortOrder
    currencyCode?: SortOrder
    transactionId?: SortOrderInput | SortOrder
    type?: SortOrder
    amount?: SortOrder
    balanceBefore?: SortOrder
    balanceAfter?: SortOrder
    reference?: SortOrderInput | SortOrder
    reason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    wallet?: WalletOrderByWithRelationInput
    currency?: CurrencyOrderByWithRelationInput
    transaction?: TransactionOrderByWithRelationInput
  }

  export type LedgerEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LedgerEntryWhereInput | LedgerEntryWhereInput[]
    OR?: LedgerEntryWhereInput[]
    NOT?: LedgerEntryWhereInput | LedgerEntryWhereInput[]
    walletId?: StringFilter<"LedgerEntry"> | string
    currencyCode?: StringFilter<"LedgerEntry"> | string
    transactionId?: StringNullableFilter<"LedgerEntry"> | string | null
    type?: EnumLedgerEntryTypeFilter<"LedgerEntry"> | $Enums.LedgerEntryType
    amount?: DecimalFilter<"LedgerEntry"> | Decimal | DecimalJsLike | number | string
    balanceBefore?: DecimalFilter<"LedgerEntry"> | Decimal | DecimalJsLike | number | string
    balanceAfter?: DecimalFilter<"LedgerEntry"> | Decimal | DecimalJsLike | number | string
    reference?: StringNullableFilter<"LedgerEntry"> | string | null
    reason?: StringNullableFilter<"LedgerEntry"> | string | null
    createdAt?: DateTimeFilter<"LedgerEntry"> | Date | string
    wallet?: XOR<WalletScalarRelationFilter, WalletWhereInput>
    currency?: XOR<CurrencyScalarRelationFilter, CurrencyWhereInput>
    transaction?: XOR<TransactionNullableScalarRelationFilter, TransactionWhereInput> | null
  }, "id">

  export type LedgerEntryOrderByWithAggregationInput = {
    id?: SortOrder
    walletId?: SortOrder
    currencyCode?: SortOrder
    transactionId?: SortOrderInput | SortOrder
    type?: SortOrder
    amount?: SortOrder
    balanceBefore?: SortOrder
    balanceAfter?: SortOrder
    reference?: SortOrderInput | SortOrder
    reason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: LedgerEntryCountOrderByAggregateInput
    _avg?: LedgerEntryAvgOrderByAggregateInput
    _max?: LedgerEntryMaxOrderByAggregateInput
    _min?: LedgerEntryMinOrderByAggregateInput
    _sum?: LedgerEntrySumOrderByAggregateInput
  }

  export type LedgerEntryScalarWhereWithAggregatesInput = {
    AND?: LedgerEntryScalarWhereWithAggregatesInput | LedgerEntryScalarWhereWithAggregatesInput[]
    OR?: LedgerEntryScalarWhereWithAggregatesInput[]
    NOT?: LedgerEntryScalarWhereWithAggregatesInput | LedgerEntryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LedgerEntry"> | string
    walletId?: StringWithAggregatesFilter<"LedgerEntry"> | string
    currencyCode?: StringWithAggregatesFilter<"LedgerEntry"> | string
    transactionId?: StringNullableWithAggregatesFilter<"LedgerEntry"> | string | null
    type?: EnumLedgerEntryTypeWithAggregatesFilter<"LedgerEntry"> | $Enums.LedgerEntryType
    amount?: DecimalWithAggregatesFilter<"LedgerEntry"> | Decimal | DecimalJsLike | number | string
    balanceBefore?: DecimalWithAggregatesFilter<"LedgerEntry"> | Decimal | DecimalJsLike | number | string
    balanceAfter?: DecimalWithAggregatesFilter<"LedgerEntry"> | Decimal | DecimalJsLike | number | string
    reference?: StringNullableWithAggregatesFilter<"LedgerEntry"> | string | null
    reason?: StringNullableWithAggregatesFilter<"LedgerEntry"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"LedgerEntry"> | Date | string
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
    wallet?: WalletCreateNestedOneWithoutUserInput
    deposits?: DepositCreateNestedManyWithoutUserInput
    transactions?: TransactionCreateNestedManyWithoutUserInput
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
    wallet?: WalletUncheckedCreateNestedOneWithoutUserInput
    deposits?: DepositUncheckedCreateNestedManyWithoutUserInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
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
    wallet?: WalletUpdateOneWithoutUserNestedInput
    deposits?: DepositUpdateManyWithoutUserNestedInput
    transactions?: TransactionUpdateManyWithoutUserNestedInput
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
    wallet?: WalletUncheckedUpdateOneWithoutUserNestedInput
    deposits?: DepositUncheckedUpdateManyWithoutUserNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
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

  export type WalletCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutWalletInput
    balances?: WalletBalanceCreateNestedManyWithoutWalletInput
    deposits?: DepositCreateNestedManyWithoutWalletInput
    transactions?: TransactionCreateNestedManyWithoutWalletInput
    ledgerEntries?: LedgerEntryCreateNestedManyWithoutWalletInput
  }

  export type WalletUncheckedCreateInput = {
    id?: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    balances?: WalletBalanceUncheckedCreateNestedManyWithoutWalletInput
    deposits?: DepositUncheckedCreateNestedManyWithoutWalletInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutWalletInput
    ledgerEntries?: LedgerEntryUncheckedCreateNestedManyWithoutWalletInput
  }

  export type WalletUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutWalletNestedInput
    balances?: WalletBalanceUpdateManyWithoutWalletNestedInput
    deposits?: DepositUpdateManyWithoutWalletNestedInput
    transactions?: TransactionUpdateManyWithoutWalletNestedInput
    ledgerEntries?: LedgerEntryUpdateManyWithoutWalletNestedInput
  }

  export type WalletUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    balances?: WalletBalanceUncheckedUpdateManyWithoutWalletNestedInput
    deposits?: DepositUncheckedUpdateManyWithoutWalletNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutWalletNestedInput
    ledgerEntries?: LedgerEntryUncheckedUpdateManyWithoutWalletNestedInput
  }

  export type WalletCreateManyInput = {
    id?: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WalletUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CurrencyCreateInput = {
    code: string
    name: string
    symbol?: string | null
    country?: string | null
    region?: string | null
    flag?: string | null
    enabled?: boolean
    depositEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    balances?: WalletBalanceCreateNestedManyWithoutCurrencyInput
    deposits?: DepositCreateNestedManyWithoutCurrencyInput
    transactions?: TransactionCreateNestedManyWithoutCurrencyInput
    ledgerEntries?: LedgerEntryCreateNestedManyWithoutCurrencyInput
  }

  export type CurrencyUncheckedCreateInput = {
    code: string
    name: string
    symbol?: string | null
    country?: string | null
    region?: string | null
    flag?: string | null
    enabled?: boolean
    depositEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    balances?: WalletBalanceUncheckedCreateNestedManyWithoutCurrencyInput
    deposits?: DepositUncheckedCreateNestedManyWithoutCurrencyInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutCurrencyInput
    ledgerEntries?: LedgerEntryUncheckedCreateNestedManyWithoutCurrencyInput
  }

  export type CurrencyUpdateInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    symbol?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: BoolFieldUpdateOperationsInput | boolean
    depositEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    balances?: WalletBalanceUpdateManyWithoutCurrencyNestedInput
    deposits?: DepositUpdateManyWithoutCurrencyNestedInput
    transactions?: TransactionUpdateManyWithoutCurrencyNestedInput
    ledgerEntries?: LedgerEntryUpdateManyWithoutCurrencyNestedInput
  }

  export type CurrencyUncheckedUpdateInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    symbol?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: BoolFieldUpdateOperationsInput | boolean
    depositEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    balances?: WalletBalanceUncheckedUpdateManyWithoutCurrencyNestedInput
    deposits?: DepositUncheckedUpdateManyWithoutCurrencyNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutCurrencyNestedInput
    ledgerEntries?: LedgerEntryUncheckedUpdateManyWithoutCurrencyNestedInput
  }

  export type CurrencyCreateManyInput = {
    code: string
    name: string
    symbol?: string | null
    country?: string | null
    region?: string | null
    flag?: string | null
    enabled?: boolean
    depositEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CurrencyUpdateManyMutationInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    symbol?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: BoolFieldUpdateOperationsInput | boolean
    depositEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CurrencyUncheckedUpdateManyInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    symbol?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: BoolFieldUpdateOperationsInput | boolean
    depositEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletBalanceCreateInput = {
    id?: string
    availableBalance?: Decimal | DecimalJsLike | number | string
    pendingBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    wallet: WalletCreateNestedOneWithoutBalancesInput
    currency: CurrencyCreateNestedOneWithoutBalancesInput
  }

  export type WalletBalanceUncheckedCreateInput = {
    id?: string
    walletId: string
    currencyCode: string
    availableBalance?: Decimal | DecimalJsLike | number | string
    pendingBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WalletBalanceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    availableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pendingBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wallet?: WalletUpdateOneRequiredWithoutBalancesNestedInput
    currency?: CurrencyUpdateOneRequiredWithoutBalancesNestedInput
  }

  export type WalletBalanceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    availableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pendingBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletBalanceCreateManyInput = {
    id?: string
    walletId: string
    currencyCode: string
    availableBalance?: Decimal | DecimalJsLike | number | string
    pendingBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WalletBalanceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    availableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pendingBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletBalanceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    availableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pendingBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepositCreateInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    exchangeRate?: Decimal | DecimalJsLike | number | string | null
    provider?: $Enums.PaymentProvider
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    country?: string | null
    countryCode?: string | null
    status?: $Enums.DepositStatus
    idempotencyKey?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutDepositsInput
    wallet: WalletCreateNestedOneWithoutDepositsInput
    currency: CurrencyCreateNestedOneWithoutDepositsInput
    transaction?: TransactionCreateNestedOneWithoutDepositInput
  }

  export type DepositUncheckedCreateInput = {
    id?: string
    userId: string
    walletId: string
    currencyCode: string
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    exchangeRate?: Decimal | DecimalJsLike | number | string | null
    provider?: $Enums.PaymentProvider
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    country?: string | null
    countryCode?: string | null
    status?: $Enums.DepositStatus
    idempotencyKey?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    transactionId?: string | null
  }

  export type DepositUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    exchangeRate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDepositStatusFieldUpdateOperationsInput | $Enums.DepositStatus
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDepositsNestedInput
    wallet?: WalletUpdateOneRequiredWithoutDepositsNestedInput
    currency?: CurrencyUpdateOneRequiredWithoutDepositsNestedInput
    transaction?: TransactionUpdateOneWithoutDepositNestedInput
  }

  export type DepositUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    exchangeRate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDepositStatusFieldUpdateOperationsInput | $Enums.DepositStatus
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DepositCreateManyInput = {
    id?: string
    userId: string
    walletId: string
    currencyCode: string
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    exchangeRate?: Decimal | DecimalJsLike | number | string | null
    provider?: $Enums.PaymentProvider
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    country?: string | null
    countryCode?: string | null
    status?: $Enums.DepositStatus
    idempotencyKey?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    transactionId?: string | null
  }

  export type DepositUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    exchangeRate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDepositStatusFieldUpdateOperationsInput | $Enums.DepositStatus
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepositUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    exchangeRate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDepositStatusFieldUpdateOperationsInput | $Enums.DepositStatus
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TransactionCreateInput = {
    id?: string
    type?: $Enums.TransactionType
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.TransactionStatus
    provider?: $Enums.PaymentProvider | null
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    reference: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTransactionsInput
    wallet: WalletCreateNestedOneWithoutTransactionsInput
    currency: CurrencyCreateNestedOneWithoutTransactionsInput
    deposit?: DepositCreateNestedOneWithoutTransactionInput
    ledgerEntries?: LedgerEntryCreateNestedManyWithoutTransactionInput
  }

  export type TransactionUncheckedCreateInput = {
    id?: string
    userId: string
    walletId: string
    currencyCode: string
    type?: $Enums.TransactionType
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.TransactionStatus
    provider?: $Enums.PaymentProvider | null
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    reference: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    deposit?: DepositUncheckedCreateNestedOneWithoutTransactionInput
    ledgerEntries?: LedgerEntryUncheckedCreateNestedManyWithoutTransactionInput
  }

  export type TransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    provider?: NullableEnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider | null
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTransactionsNestedInput
    wallet?: WalletUpdateOneRequiredWithoutTransactionsNestedInput
    currency?: CurrencyUpdateOneRequiredWithoutTransactionsNestedInput
    deposit?: DepositUpdateOneWithoutTransactionNestedInput
    ledgerEntries?: LedgerEntryUpdateManyWithoutTransactionNestedInput
  }

  export type TransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    provider?: NullableEnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider | null
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deposit?: DepositUncheckedUpdateOneWithoutTransactionNestedInput
    ledgerEntries?: LedgerEntryUncheckedUpdateManyWithoutTransactionNestedInput
  }

  export type TransactionCreateManyInput = {
    id?: string
    userId: string
    walletId: string
    currencyCode: string
    type?: $Enums.TransactionType
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.TransactionStatus
    provider?: $Enums.PaymentProvider | null
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    reference: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    provider?: NullableEnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider | null
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    provider?: NullableEnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider | null
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LedgerEntryCreateInput = {
    id?: string
    type: $Enums.LedgerEntryType
    amount: Decimal | DecimalJsLike | number | string
    balanceBefore: Decimal | DecimalJsLike | number | string
    balanceAfter: Decimal | DecimalJsLike | number | string
    reference?: string | null
    reason?: string | null
    createdAt?: Date | string
    wallet: WalletCreateNestedOneWithoutLedgerEntriesInput
    currency: CurrencyCreateNestedOneWithoutLedgerEntriesInput
    transaction?: TransactionCreateNestedOneWithoutLedgerEntriesInput
  }

  export type LedgerEntryUncheckedCreateInput = {
    id?: string
    walletId: string
    currencyCode: string
    transactionId?: string | null
    type: $Enums.LedgerEntryType
    amount: Decimal | DecimalJsLike | number | string
    balanceBefore: Decimal | DecimalJsLike | number | string
    balanceAfter: Decimal | DecimalJsLike | number | string
    reference?: string | null
    reason?: string | null
    createdAt?: Date | string
  }

  export type LedgerEntryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumLedgerEntryTypeFieldUpdateOperationsInput | $Enums.LedgerEntryType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceBefore?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceAfter?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wallet?: WalletUpdateOneRequiredWithoutLedgerEntriesNestedInput
    currency?: CurrencyUpdateOneRequiredWithoutLedgerEntriesNestedInput
    transaction?: TransactionUpdateOneWithoutLedgerEntriesNestedInput
  }

  export type LedgerEntryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumLedgerEntryTypeFieldUpdateOperationsInput | $Enums.LedgerEntryType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceBefore?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceAfter?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LedgerEntryCreateManyInput = {
    id?: string
    walletId: string
    currencyCode: string
    transactionId?: string | null
    type: $Enums.LedgerEntryType
    amount: Decimal | DecimalJsLike | number | string
    balanceBefore: Decimal | DecimalJsLike | number | string
    balanceAfter: Decimal | DecimalJsLike | number | string
    reference?: string | null
    reason?: string | null
    createdAt?: Date | string
  }

  export type LedgerEntryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumLedgerEntryTypeFieldUpdateOperationsInput | $Enums.LedgerEntryType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceBefore?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceAfter?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LedgerEntryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumLedgerEntryTypeFieldUpdateOperationsInput | $Enums.LedgerEntryType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceBefore?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceAfter?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
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

  export type WalletNullableScalarRelationFilter = {
    is?: WalletWhereInput | null
    isNot?: WalletWhereInput | null
  }

  export type DepositListRelationFilter = {
    every?: DepositWhereInput
    some?: DepositWhereInput
    none?: DepositWhereInput
  }

  export type TransactionListRelationFilter = {
    every?: TransactionWhereInput
    some?: TransactionWhereInput
    none?: TransactionWhereInput
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

  export type DepositOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TransactionOrderByRelationAggregateInput = {
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

  export type WalletBalanceListRelationFilter = {
    every?: WalletBalanceWhereInput
    some?: WalletBalanceWhereInput
    none?: WalletBalanceWhereInput
  }

  export type LedgerEntryListRelationFilter = {
    every?: LedgerEntryWhereInput
    some?: LedgerEntryWhereInput
    none?: LedgerEntryWhereInput
  }

  export type WalletBalanceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LedgerEntryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WalletCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WalletMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WalletMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CurrencyCountOrderByAggregateInput = {
    code?: SortOrder
    name?: SortOrder
    symbol?: SortOrder
    country?: SortOrder
    region?: SortOrder
    flag?: SortOrder
    enabled?: SortOrder
    depositEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CurrencyMaxOrderByAggregateInput = {
    code?: SortOrder
    name?: SortOrder
    symbol?: SortOrder
    country?: SortOrder
    region?: SortOrder
    flag?: SortOrder
    enabled?: SortOrder
    depositEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CurrencyMinOrderByAggregateInput = {
    code?: SortOrder
    name?: SortOrder
    symbol?: SortOrder
    country?: SortOrder
    region?: SortOrder
    flag?: SortOrder
    enabled?: SortOrder
    depositEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type WalletScalarRelationFilter = {
    is?: WalletWhereInput
    isNot?: WalletWhereInput
  }

  export type CurrencyScalarRelationFilter = {
    is?: CurrencyWhereInput
    isNot?: CurrencyWhereInput
  }

  export type WalletBalanceWalletIdCurrencyCodeCompoundUniqueInput = {
    walletId: string
    currencyCode: string
  }

  export type WalletBalanceCountOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    currencyCode?: SortOrder
    availableBalance?: SortOrder
    pendingBalance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WalletBalanceAvgOrderByAggregateInput = {
    availableBalance?: SortOrder
    pendingBalance?: SortOrder
  }

  export type WalletBalanceMaxOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    currencyCode?: SortOrder
    availableBalance?: SortOrder
    pendingBalance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WalletBalanceMinOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    currencyCode?: SortOrder
    availableBalance?: SortOrder
    pendingBalance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WalletBalanceSumOrderByAggregateInput = {
    availableBalance?: SortOrder
    pendingBalance?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type EnumPaymentProviderFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentProvider | EnumPaymentProviderFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentProviderFilter<$PrismaModel> | $Enums.PaymentProvider
  }

  export type EnumPaymentMethodNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel> | null
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPaymentMethodNullableFilter<$PrismaModel> | $Enums.PaymentMethod | null
  }

  export type EnumDepositStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DepositStatus | EnumDepositStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DepositStatus[] | ListEnumDepositStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DepositStatus[] | ListEnumDepositStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDepositStatusFilter<$PrismaModel> | $Enums.DepositStatus
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type TransactionNullableScalarRelationFilter = {
    is?: TransactionWhereInput | null
    isNot?: TransactionWhereInput | null
  }

  export type DepositUserIdIdempotencyKeyCompoundUniqueInput = {
    userId: string
    idempotencyKey: string
  }

  export type DepositCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    walletId?: SortOrder
    currencyCode?: SortOrder
    amount?: SortOrder
    fee?: SortOrder
    netAmount?: SortOrder
    exchangeRate?: SortOrder
    provider?: SortOrder
    providerTransactionId?: SortOrder
    providerReference?: SortOrder
    paymentMethod?: SortOrder
    country?: SortOrder
    countryCode?: SortOrder
    status?: SortOrder
    idempotencyKey?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    transactionId?: SortOrder
  }

  export type DepositAvgOrderByAggregateInput = {
    amount?: SortOrder
    fee?: SortOrder
    netAmount?: SortOrder
    exchangeRate?: SortOrder
  }

  export type DepositMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    walletId?: SortOrder
    currencyCode?: SortOrder
    amount?: SortOrder
    fee?: SortOrder
    netAmount?: SortOrder
    exchangeRate?: SortOrder
    provider?: SortOrder
    providerTransactionId?: SortOrder
    providerReference?: SortOrder
    paymentMethod?: SortOrder
    country?: SortOrder
    countryCode?: SortOrder
    status?: SortOrder
    idempotencyKey?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    transactionId?: SortOrder
  }

  export type DepositMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    walletId?: SortOrder
    currencyCode?: SortOrder
    amount?: SortOrder
    fee?: SortOrder
    netAmount?: SortOrder
    exchangeRate?: SortOrder
    provider?: SortOrder
    providerTransactionId?: SortOrder
    providerReference?: SortOrder
    paymentMethod?: SortOrder
    country?: SortOrder
    countryCode?: SortOrder
    status?: SortOrder
    idempotencyKey?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    transactionId?: SortOrder
  }

  export type DepositSumOrderByAggregateInput = {
    amount?: SortOrder
    fee?: SortOrder
    netAmount?: SortOrder
    exchangeRate?: SortOrder
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type EnumPaymentProviderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentProvider | EnumPaymentProviderFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentProviderWithAggregatesFilter<$PrismaModel> | $Enums.PaymentProvider
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentProviderFilter<$PrismaModel>
    _max?: NestedEnumPaymentProviderFilter<$PrismaModel>
  }

  export type EnumPaymentMethodNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel> | null
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPaymentMethodNullableWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodNullableFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodNullableFilter<$PrismaModel>
  }

  export type EnumDepositStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DepositStatus | EnumDepositStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DepositStatus[] | ListEnumDepositStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DepositStatus[] | ListEnumDepositStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDepositStatusWithAggregatesFilter<$PrismaModel> | $Enums.DepositStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDepositStatusFilter<$PrismaModel>
    _max?: NestedEnumDepositStatusFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumTransactionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionTypeFilter<$PrismaModel> | $Enums.TransactionType
  }

  export type EnumTransactionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusFilter<$PrismaModel> | $Enums.TransactionStatus
  }

  export type EnumPaymentProviderNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentProvider | EnumPaymentProviderFieldRefInput<$PrismaModel> | null
    in?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPaymentProviderNullableFilter<$PrismaModel> | $Enums.PaymentProvider | null
  }

  export type DepositNullableScalarRelationFilter = {
    is?: DepositWhereInput | null
    isNot?: DepositWhereInput | null
  }

  export type TransactionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    walletId?: SortOrder
    currencyCode?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    fee?: SortOrder
    netAmount?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    providerTransactionId?: SortOrder
    providerReference?: SortOrder
    paymentMethod?: SortOrder
    reference?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionAvgOrderByAggregateInput = {
    amount?: SortOrder
    fee?: SortOrder
    netAmount?: SortOrder
  }

  export type TransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    walletId?: SortOrder
    currencyCode?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    fee?: SortOrder
    netAmount?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    providerTransactionId?: SortOrder
    providerReference?: SortOrder
    paymentMethod?: SortOrder
    reference?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    walletId?: SortOrder
    currencyCode?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    fee?: SortOrder
    netAmount?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    providerTransactionId?: SortOrder
    providerReference?: SortOrder
    paymentMethod?: SortOrder
    reference?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionSumOrderByAggregateInput = {
    amount?: SortOrder
    fee?: SortOrder
    netAmount?: SortOrder
  }

  export type EnumTransactionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionTypeWithAggregatesFilter<$PrismaModel> | $Enums.TransactionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionTypeFilter<$PrismaModel>
    _max?: NestedEnumTransactionTypeFilter<$PrismaModel>
  }

  export type EnumTransactionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusWithAggregatesFilter<$PrismaModel> | $Enums.TransactionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionStatusFilter<$PrismaModel>
    _max?: NestedEnumTransactionStatusFilter<$PrismaModel>
  }

  export type EnumPaymentProviderNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentProvider | EnumPaymentProviderFieldRefInput<$PrismaModel> | null
    in?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPaymentProviderNullableWithAggregatesFilter<$PrismaModel> | $Enums.PaymentProvider | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPaymentProviderNullableFilter<$PrismaModel>
    _max?: NestedEnumPaymentProviderNullableFilter<$PrismaModel>
  }

  export type EnumLedgerEntryTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.LedgerEntryType | EnumLedgerEntryTypeFieldRefInput<$PrismaModel>
    in?: $Enums.LedgerEntryType[] | ListEnumLedgerEntryTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.LedgerEntryType[] | ListEnumLedgerEntryTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumLedgerEntryTypeFilter<$PrismaModel> | $Enums.LedgerEntryType
  }

  export type LedgerEntryCountOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    currencyCode?: SortOrder
    transactionId?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    balanceBefore?: SortOrder
    balanceAfter?: SortOrder
    reference?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
  }

  export type LedgerEntryAvgOrderByAggregateInput = {
    amount?: SortOrder
    balanceBefore?: SortOrder
    balanceAfter?: SortOrder
  }

  export type LedgerEntryMaxOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    currencyCode?: SortOrder
    transactionId?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    balanceBefore?: SortOrder
    balanceAfter?: SortOrder
    reference?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
  }

  export type LedgerEntryMinOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    currencyCode?: SortOrder
    transactionId?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    balanceBefore?: SortOrder
    balanceAfter?: SortOrder
    reference?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
  }

  export type LedgerEntrySumOrderByAggregateInput = {
    amount?: SortOrder
    balanceBefore?: SortOrder
    balanceAfter?: SortOrder
  }

  export type EnumLedgerEntryTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LedgerEntryType | EnumLedgerEntryTypeFieldRefInput<$PrismaModel>
    in?: $Enums.LedgerEntryType[] | ListEnumLedgerEntryTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.LedgerEntryType[] | ListEnumLedgerEntryTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumLedgerEntryTypeWithAggregatesFilter<$PrismaModel> | $Enums.LedgerEntryType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLedgerEntryTypeFilter<$PrismaModel>
    _max?: NestedEnumLedgerEntryTypeFilter<$PrismaModel>
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

  export type WalletCreateNestedOneWithoutUserInput = {
    create?: XOR<WalletCreateWithoutUserInput, WalletUncheckedCreateWithoutUserInput>
    connectOrCreate?: WalletCreateOrConnectWithoutUserInput
    connect?: WalletWhereUniqueInput
  }

  export type DepositCreateNestedManyWithoutUserInput = {
    create?: XOR<DepositCreateWithoutUserInput, DepositUncheckedCreateWithoutUserInput> | DepositCreateWithoutUserInput[] | DepositUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DepositCreateOrConnectWithoutUserInput | DepositCreateOrConnectWithoutUserInput[]
    createMany?: DepositCreateManyUserInputEnvelope
    connect?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
  }

  export type TransactionCreateNestedManyWithoutUserInput = {
    create?: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput> | TransactionCreateWithoutUserInput[] | TransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutUserInput | TransactionCreateOrConnectWithoutUserInput[]
    createMany?: TransactionCreateManyUserInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
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

  export type WalletUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<WalletCreateWithoutUserInput, WalletUncheckedCreateWithoutUserInput>
    connectOrCreate?: WalletCreateOrConnectWithoutUserInput
    connect?: WalletWhereUniqueInput
  }

  export type DepositUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<DepositCreateWithoutUserInput, DepositUncheckedCreateWithoutUserInput> | DepositCreateWithoutUserInput[] | DepositUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DepositCreateOrConnectWithoutUserInput | DepositCreateOrConnectWithoutUserInput[]
    createMany?: DepositCreateManyUserInputEnvelope
    connect?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput> | TransactionCreateWithoutUserInput[] | TransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutUserInput | TransactionCreateOrConnectWithoutUserInput[]
    createMany?: TransactionCreateManyUserInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
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

  export type WalletUpdateOneWithoutUserNestedInput = {
    create?: XOR<WalletCreateWithoutUserInput, WalletUncheckedCreateWithoutUserInput>
    connectOrCreate?: WalletCreateOrConnectWithoutUserInput
    upsert?: WalletUpsertWithoutUserInput
    disconnect?: WalletWhereInput | boolean
    delete?: WalletWhereInput | boolean
    connect?: WalletWhereUniqueInput
    update?: XOR<XOR<WalletUpdateToOneWithWhereWithoutUserInput, WalletUpdateWithoutUserInput>, WalletUncheckedUpdateWithoutUserInput>
  }

  export type DepositUpdateManyWithoutUserNestedInput = {
    create?: XOR<DepositCreateWithoutUserInput, DepositUncheckedCreateWithoutUserInput> | DepositCreateWithoutUserInput[] | DepositUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DepositCreateOrConnectWithoutUserInput | DepositCreateOrConnectWithoutUserInput[]
    upsert?: DepositUpsertWithWhereUniqueWithoutUserInput | DepositUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DepositCreateManyUserInputEnvelope
    set?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
    disconnect?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
    delete?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
    connect?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
    update?: DepositUpdateWithWhereUniqueWithoutUserInput | DepositUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DepositUpdateManyWithWhereWithoutUserInput | DepositUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DepositScalarWhereInput | DepositScalarWhereInput[]
  }

  export type TransactionUpdateManyWithoutUserNestedInput = {
    create?: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput> | TransactionCreateWithoutUserInput[] | TransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutUserInput | TransactionCreateOrConnectWithoutUserInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutUserInput | TransactionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TransactionCreateManyUserInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutUserInput | TransactionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutUserInput | TransactionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
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

  export type WalletUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<WalletCreateWithoutUserInput, WalletUncheckedCreateWithoutUserInput>
    connectOrCreate?: WalletCreateOrConnectWithoutUserInput
    upsert?: WalletUpsertWithoutUserInput
    disconnect?: WalletWhereInput | boolean
    delete?: WalletWhereInput | boolean
    connect?: WalletWhereUniqueInput
    update?: XOR<XOR<WalletUpdateToOneWithWhereWithoutUserInput, WalletUpdateWithoutUserInput>, WalletUncheckedUpdateWithoutUserInput>
  }

  export type DepositUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<DepositCreateWithoutUserInput, DepositUncheckedCreateWithoutUserInput> | DepositCreateWithoutUserInput[] | DepositUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DepositCreateOrConnectWithoutUserInput | DepositCreateOrConnectWithoutUserInput[]
    upsert?: DepositUpsertWithWhereUniqueWithoutUserInput | DepositUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DepositCreateManyUserInputEnvelope
    set?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
    disconnect?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
    delete?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
    connect?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
    update?: DepositUpdateWithWhereUniqueWithoutUserInput | DepositUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DepositUpdateManyWithWhereWithoutUserInput | DepositUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DepositScalarWhereInput | DepositScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput> | TransactionCreateWithoutUserInput[] | TransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutUserInput | TransactionCreateOrConnectWithoutUserInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutUserInput | TransactionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TransactionCreateManyUserInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutUserInput | TransactionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutUserInput | TransactionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
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

  export type UserCreateNestedOneWithoutWalletInput = {
    create?: XOR<UserCreateWithoutWalletInput, UserUncheckedCreateWithoutWalletInput>
    connectOrCreate?: UserCreateOrConnectWithoutWalletInput
    connect?: UserWhereUniqueInput
  }

  export type WalletBalanceCreateNestedManyWithoutWalletInput = {
    create?: XOR<WalletBalanceCreateWithoutWalletInput, WalletBalanceUncheckedCreateWithoutWalletInput> | WalletBalanceCreateWithoutWalletInput[] | WalletBalanceUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: WalletBalanceCreateOrConnectWithoutWalletInput | WalletBalanceCreateOrConnectWithoutWalletInput[]
    createMany?: WalletBalanceCreateManyWalletInputEnvelope
    connect?: WalletBalanceWhereUniqueInput | WalletBalanceWhereUniqueInput[]
  }

  export type DepositCreateNestedManyWithoutWalletInput = {
    create?: XOR<DepositCreateWithoutWalletInput, DepositUncheckedCreateWithoutWalletInput> | DepositCreateWithoutWalletInput[] | DepositUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: DepositCreateOrConnectWithoutWalletInput | DepositCreateOrConnectWithoutWalletInput[]
    createMany?: DepositCreateManyWalletInputEnvelope
    connect?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
  }

  export type TransactionCreateNestedManyWithoutWalletInput = {
    create?: XOR<TransactionCreateWithoutWalletInput, TransactionUncheckedCreateWithoutWalletInput> | TransactionCreateWithoutWalletInput[] | TransactionUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutWalletInput | TransactionCreateOrConnectWithoutWalletInput[]
    createMany?: TransactionCreateManyWalletInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type LedgerEntryCreateNestedManyWithoutWalletInput = {
    create?: XOR<LedgerEntryCreateWithoutWalletInput, LedgerEntryUncheckedCreateWithoutWalletInput> | LedgerEntryCreateWithoutWalletInput[] | LedgerEntryUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: LedgerEntryCreateOrConnectWithoutWalletInput | LedgerEntryCreateOrConnectWithoutWalletInput[]
    createMany?: LedgerEntryCreateManyWalletInputEnvelope
    connect?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
  }

  export type WalletBalanceUncheckedCreateNestedManyWithoutWalletInput = {
    create?: XOR<WalletBalanceCreateWithoutWalletInput, WalletBalanceUncheckedCreateWithoutWalletInput> | WalletBalanceCreateWithoutWalletInput[] | WalletBalanceUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: WalletBalanceCreateOrConnectWithoutWalletInput | WalletBalanceCreateOrConnectWithoutWalletInput[]
    createMany?: WalletBalanceCreateManyWalletInputEnvelope
    connect?: WalletBalanceWhereUniqueInput | WalletBalanceWhereUniqueInput[]
  }

  export type DepositUncheckedCreateNestedManyWithoutWalletInput = {
    create?: XOR<DepositCreateWithoutWalletInput, DepositUncheckedCreateWithoutWalletInput> | DepositCreateWithoutWalletInput[] | DepositUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: DepositCreateOrConnectWithoutWalletInput | DepositCreateOrConnectWithoutWalletInput[]
    createMany?: DepositCreateManyWalletInputEnvelope
    connect?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutWalletInput = {
    create?: XOR<TransactionCreateWithoutWalletInput, TransactionUncheckedCreateWithoutWalletInput> | TransactionCreateWithoutWalletInput[] | TransactionUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutWalletInput | TransactionCreateOrConnectWithoutWalletInput[]
    createMany?: TransactionCreateManyWalletInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type LedgerEntryUncheckedCreateNestedManyWithoutWalletInput = {
    create?: XOR<LedgerEntryCreateWithoutWalletInput, LedgerEntryUncheckedCreateWithoutWalletInput> | LedgerEntryCreateWithoutWalletInput[] | LedgerEntryUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: LedgerEntryCreateOrConnectWithoutWalletInput | LedgerEntryCreateOrConnectWithoutWalletInput[]
    createMany?: LedgerEntryCreateManyWalletInputEnvelope
    connect?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutWalletNestedInput = {
    create?: XOR<UserCreateWithoutWalletInput, UserUncheckedCreateWithoutWalletInput>
    connectOrCreate?: UserCreateOrConnectWithoutWalletInput
    upsert?: UserUpsertWithoutWalletInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutWalletInput, UserUpdateWithoutWalletInput>, UserUncheckedUpdateWithoutWalletInput>
  }

  export type WalletBalanceUpdateManyWithoutWalletNestedInput = {
    create?: XOR<WalletBalanceCreateWithoutWalletInput, WalletBalanceUncheckedCreateWithoutWalletInput> | WalletBalanceCreateWithoutWalletInput[] | WalletBalanceUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: WalletBalanceCreateOrConnectWithoutWalletInput | WalletBalanceCreateOrConnectWithoutWalletInput[]
    upsert?: WalletBalanceUpsertWithWhereUniqueWithoutWalletInput | WalletBalanceUpsertWithWhereUniqueWithoutWalletInput[]
    createMany?: WalletBalanceCreateManyWalletInputEnvelope
    set?: WalletBalanceWhereUniqueInput | WalletBalanceWhereUniqueInput[]
    disconnect?: WalletBalanceWhereUniqueInput | WalletBalanceWhereUniqueInput[]
    delete?: WalletBalanceWhereUniqueInput | WalletBalanceWhereUniqueInput[]
    connect?: WalletBalanceWhereUniqueInput | WalletBalanceWhereUniqueInput[]
    update?: WalletBalanceUpdateWithWhereUniqueWithoutWalletInput | WalletBalanceUpdateWithWhereUniqueWithoutWalletInput[]
    updateMany?: WalletBalanceUpdateManyWithWhereWithoutWalletInput | WalletBalanceUpdateManyWithWhereWithoutWalletInput[]
    deleteMany?: WalletBalanceScalarWhereInput | WalletBalanceScalarWhereInput[]
  }

  export type DepositUpdateManyWithoutWalletNestedInput = {
    create?: XOR<DepositCreateWithoutWalletInput, DepositUncheckedCreateWithoutWalletInput> | DepositCreateWithoutWalletInput[] | DepositUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: DepositCreateOrConnectWithoutWalletInput | DepositCreateOrConnectWithoutWalletInput[]
    upsert?: DepositUpsertWithWhereUniqueWithoutWalletInput | DepositUpsertWithWhereUniqueWithoutWalletInput[]
    createMany?: DepositCreateManyWalletInputEnvelope
    set?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
    disconnect?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
    delete?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
    connect?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
    update?: DepositUpdateWithWhereUniqueWithoutWalletInput | DepositUpdateWithWhereUniqueWithoutWalletInput[]
    updateMany?: DepositUpdateManyWithWhereWithoutWalletInput | DepositUpdateManyWithWhereWithoutWalletInput[]
    deleteMany?: DepositScalarWhereInput | DepositScalarWhereInput[]
  }

  export type TransactionUpdateManyWithoutWalletNestedInput = {
    create?: XOR<TransactionCreateWithoutWalletInput, TransactionUncheckedCreateWithoutWalletInput> | TransactionCreateWithoutWalletInput[] | TransactionUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutWalletInput | TransactionCreateOrConnectWithoutWalletInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutWalletInput | TransactionUpsertWithWhereUniqueWithoutWalletInput[]
    createMany?: TransactionCreateManyWalletInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutWalletInput | TransactionUpdateWithWhereUniqueWithoutWalletInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutWalletInput | TransactionUpdateManyWithWhereWithoutWalletInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type LedgerEntryUpdateManyWithoutWalletNestedInput = {
    create?: XOR<LedgerEntryCreateWithoutWalletInput, LedgerEntryUncheckedCreateWithoutWalletInput> | LedgerEntryCreateWithoutWalletInput[] | LedgerEntryUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: LedgerEntryCreateOrConnectWithoutWalletInput | LedgerEntryCreateOrConnectWithoutWalletInput[]
    upsert?: LedgerEntryUpsertWithWhereUniqueWithoutWalletInput | LedgerEntryUpsertWithWhereUniqueWithoutWalletInput[]
    createMany?: LedgerEntryCreateManyWalletInputEnvelope
    set?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    disconnect?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    delete?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    connect?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    update?: LedgerEntryUpdateWithWhereUniqueWithoutWalletInput | LedgerEntryUpdateWithWhereUniqueWithoutWalletInput[]
    updateMany?: LedgerEntryUpdateManyWithWhereWithoutWalletInput | LedgerEntryUpdateManyWithWhereWithoutWalletInput[]
    deleteMany?: LedgerEntryScalarWhereInput | LedgerEntryScalarWhereInput[]
  }

  export type WalletBalanceUncheckedUpdateManyWithoutWalletNestedInput = {
    create?: XOR<WalletBalanceCreateWithoutWalletInput, WalletBalanceUncheckedCreateWithoutWalletInput> | WalletBalanceCreateWithoutWalletInput[] | WalletBalanceUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: WalletBalanceCreateOrConnectWithoutWalletInput | WalletBalanceCreateOrConnectWithoutWalletInput[]
    upsert?: WalletBalanceUpsertWithWhereUniqueWithoutWalletInput | WalletBalanceUpsertWithWhereUniqueWithoutWalletInput[]
    createMany?: WalletBalanceCreateManyWalletInputEnvelope
    set?: WalletBalanceWhereUniqueInput | WalletBalanceWhereUniqueInput[]
    disconnect?: WalletBalanceWhereUniqueInput | WalletBalanceWhereUniqueInput[]
    delete?: WalletBalanceWhereUniqueInput | WalletBalanceWhereUniqueInput[]
    connect?: WalletBalanceWhereUniqueInput | WalletBalanceWhereUniqueInput[]
    update?: WalletBalanceUpdateWithWhereUniqueWithoutWalletInput | WalletBalanceUpdateWithWhereUniqueWithoutWalletInput[]
    updateMany?: WalletBalanceUpdateManyWithWhereWithoutWalletInput | WalletBalanceUpdateManyWithWhereWithoutWalletInput[]
    deleteMany?: WalletBalanceScalarWhereInput | WalletBalanceScalarWhereInput[]
  }

  export type DepositUncheckedUpdateManyWithoutWalletNestedInput = {
    create?: XOR<DepositCreateWithoutWalletInput, DepositUncheckedCreateWithoutWalletInput> | DepositCreateWithoutWalletInput[] | DepositUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: DepositCreateOrConnectWithoutWalletInput | DepositCreateOrConnectWithoutWalletInput[]
    upsert?: DepositUpsertWithWhereUniqueWithoutWalletInput | DepositUpsertWithWhereUniqueWithoutWalletInput[]
    createMany?: DepositCreateManyWalletInputEnvelope
    set?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
    disconnect?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
    delete?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
    connect?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
    update?: DepositUpdateWithWhereUniqueWithoutWalletInput | DepositUpdateWithWhereUniqueWithoutWalletInput[]
    updateMany?: DepositUpdateManyWithWhereWithoutWalletInput | DepositUpdateManyWithWhereWithoutWalletInput[]
    deleteMany?: DepositScalarWhereInput | DepositScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutWalletNestedInput = {
    create?: XOR<TransactionCreateWithoutWalletInput, TransactionUncheckedCreateWithoutWalletInput> | TransactionCreateWithoutWalletInput[] | TransactionUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutWalletInput | TransactionCreateOrConnectWithoutWalletInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutWalletInput | TransactionUpsertWithWhereUniqueWithoutWalletInput[]
    createMany?: TransactionCreateManyWalletInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutWalletInput | TransactionUpdateWithWhereUniqueWithoutWalletInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutWalletInput | TransactionUpdateManyWithWhereWithoutWalletInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type LedgerEntryUncheckedUpdateManyWithoutWalletNestedInput = {
    create?: XOR<LedgerEntryCreateWithoutWalletInput, LedgerEntryUncheckedCreateWithoutWalletInput> | LedgerEntryCreateWithoutWalletInput[] | LedgerEntryUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: LedgerEntryCreateOrConnectWithoutWalletInput | LedgerEntryCreateOrConnectWithoutWalletInput[]
    upsert?: LedgerEntryUpsertWithWhereUniqueWithoutWalletInput | LedgerEntryUpsertWithWhereUniqueWithoutWalletInput[]
    createMany?: LedgerEntryCreateManyWalletInputEnvelope
    set?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    disconnect?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    delete?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    connect?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    update?: LedgerEntryUpdateWithWhereUniqueWithoutWalletInput | LedgerEntryUpdateWithWhereUniqueWithoutWalletInput[]
    updateMany?: LedgerEntryUpdateManyWithWhereWithoutWalletInput | LedgerEntryUpdateManyWithWhereWithoutWalletInput[]
    deleteMany?: LedgerEntryScalarWhereInput | LedgerEntryScalarWhereInput[]
  }

  export type WalletBalanceCreateNestedManyWithoutCurrencyInput = {
    create?: XOR<WalletBalanceCreateWithoutCurrencyInput, WalletBalanceUncheckedCreateWithoutCurrencyInput> | WalletBalanceCreateWithoutCurrencyInput[] | WalletBalanceUncheckedCreateWithoutCurrencyInput[]
    connectOrCreate?: WalletBalanceCreateOrConnectWithoutCurrencyInput | WalletBalanceCreateOrConnectWithoutCurrencyInput[]
    createMany?: WalletBalanceCreateManyCurrencyInputEnvelope
    connect?: WalletBalanceWhereUniqueInput | WalletBalanceWhereUniqueInput[]
  }

  export type DepositCreateNestedManyWithoutCurrencyInput = {
    create?: XOR<DepositCreateWithoutCurrencyInput, DepositUncheckedCreateWithoutCurrencyInput> | DepositCreateWithoutCurrencyInput[] | DepositUncheckedCreateWithoutCurrencyInput[]
    connectOrCreate?: DepositCreateOrConnectWithoutCurrencyInput | DepositCreateOrConnectWithoutCurrencyInput[]
    createMany?: DepositCreateManyCurrencyInputEnvelope
    connect?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
  }

  export type TransactionCreateNestedManyWithoutCurrencyInput = {
    create?: XOR<TransactionCreateWithoutCurrencyInput, TransactionUncheckedCreateWithoutCurrencyInput> | TransactionCreateWithoutCurrencyInput[] | TransactionUncheckedCreateWithoutCurrencyInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutCurrencyInput | TransactionCreateOrConnectWithoutCurrencyInput[]
    createMany?: TransactionCreateManyCurrencyInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type LedgerEntryCreateNestedManyWithoutCurrencyInput = {
    create?: XOR<LedgerEntryCreateWithoutCurrencyInput, LedgerEntryUncheckedCreateWithoutCurrencyInput> | LedgerEntryCreateWithoutCurrencyInput[] | LedgerEntryUncheckedCreateWithoutCurrencyInput[]
    connectOrCreate?: LedgerEntryCreateOrConnectWithoutCurrencyInput | LedgerEntryCreateOrConnectWithoutCurrencyInput[]
    createMany?: LedgerEntryCreateManyCurrencyInputEnvelope
    connect?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
  }

  export type WalletBalanceUncheckedCreateNestedManyWithoutCurrencyInput = {
    create?: XOR<WalletBalanceCreateWithoutCurrencyInput, WalletBalanceUncheckedCreateWithoutCurrencyInput> | WalletBalanceCreateWithoutCurrencyInput[] | WalletBalanceUncheckedCreateWithoutCurrencyInput[]
    connectOrCreate?: WalletBalanceCreateOrConnectWithoutCurrencyInput | WalletBalanceCreateOrConnectWithoutCurrencyInput[]
    createMany?: WalletBalanceCreateManyCurrencyInputEnvelope
    connect?: WalletBalanceWhereUniqueInput | WalletBalanceWhereUniqueInput[]
  }

  export type DepositUncheckedCreateNestedManyWithoutCurrencyInput = {
    create?: XOR<DepositCreateWithoutCurrencyInput, DepositUncheckedCreateWithoutCurrencyInput> | DepositCreateWithoutCurrencyInput[] | DepositUncheckedCreateWithoutCurrencyInput[]
    connectOrCreate?: DepositCreateOrConnectWithoutCurrencyInput | DepositCreateOrConnectWithoutCurrencyInput[]
    createMany?: DepositCreateManyCurrencyInputEnvelope
    connect?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutCurrencyInput = {
    create?: XOR<TransactionCreateWithoutCurrencyInput, TransactionUncheckedCreateWithoutCurrencyInput> | TransactionCreateWithoutCurrencyInput[] | TransactionUncheckedCreateWithoutCurrencyInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutCurrencyInput | TransactionCreateOrConnectWithoutCurrencyInput[]
    createMany?: TransactionCreateManyCurrencyInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type LedgerEntryUncheckedCreateNestedManyWithoutCurrencyInput = {
    create?: XOR<LedgerEntryCreateWithoutCurrencyInput, LedgerEntryUncheckedCreateWithoutCurrencyInput> | LedgerEntryCreateWithoutCurrencyInput[] | LedgerEntryUncheckedCreateWithoutCurrencyInput[]
    connectOrCreate?: LedgerEntryCreateOrConnectWithoutCurrencyInput | LedgerEntryCreateOrConnectWithoutCurrencyInput[]
    createMany?: LedgerEntryCreateManyCurrencyInputEnvelope
    connect?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
  }

  export type WalletBalanceUpdateManyWithoutCurrencyNestedInput = {
    create?: XOR<WalletBalanceCreateWithoutCurrencyInput, WalletBalanceUncheckedCreateWithoutCurrencyInput> | WalletBalanceCreateWithoutCurrencyInput[] | WalletBalanceUncheckedCreateWithoutCurrencyInput[]
    connectOrCreate?: WalletBalanceCreateOrConnectWithoutCurrencyInput | WalletBalanceCreateOrConnectWithoutCurrencyInput[]
    upsert?: WalletBalanceUpsertWithWhereUniqueWithoutCurrencyInput | WalletBalanceUpsertWithWhereUniqueWithoutCurrencyInput[]
    createMany?: WalletBalanceCreateManyCurrencyInputEnvelope
    set?: WalletBalanceWhereUniqueInput | WalletBalanceWhereUniqueInput[]
    disconnect?: WalletBalanceWhereUniqueInput | WalletBalanceWhereUniqueInput[]
    delete?: WalletBalanceWhereUniqueInput | WalletBalanceWhereUniqueInput[]
    connect?: WalletBalanceWhereUniqueInput | WalletBalanceWhereUniqueInput[]
    update?: WalletBalanceUpdateWithWhereUniqueWithoutCurrencyInput | WalletBalanceUpdateWithWhereUniqueWithoutCurrencyInput[]
    updateMany?: WalletBalanceUpdateManyWithWhereWithoutCurrencyInput | WalletBalanceUpdateManyWithWhereWithoutCurrencyInput[]
    deleteMany?: WalletBalanceScalarWhereInput | WalletBalanceScalarWhereInput[]
  }

  export type DepositUpdateManyWithoutCurrencyNestedInput = {
    create?: XOR<DepositCreateWithoutCurrencyInput, DepositUncheckedCreateWithoutCurrencyInput> | DepositCreateWithoutCurrencyInput[] | DepositUncheckedCreateWithoutCurrencyInput[]
    connectOrCreate?: DepositCreateOrConnectWithoutCurrencyInput | DepositCreateOrConnectWithoutCurrencyInput[]
    upsert?: DepositUpsertWithWhereUniqueWithoutCurrencyInput | DepositUpsertWithWhereUniqueWithoutCurrencyInput[]
    createMany?: DepositCreateManyCurrencyInputEnvelope
    set?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
    disconnect?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
    delete?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
    connect?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
    update?: DepositUpdateWithWhereUniqueWithoutCurrencyInput | DepositUpdateWithWhereUniqueWithoutCurrencyInput[]
    updateMany?: DepositUpdateManyWithWhereWithoutCurrencyInput | DepositUpdateManyWithWhereWithoutCurrencyInput[]
    deleteMany?: DepositScalarWhereInput | DepositScalarWhereInput[]
  }

  export type TransactionUpdateManyWithoutCurrencyNestedInput = {
    create?: XOR<TransactionCreateWithoutCurrencyInput, TransactionUncheckedCreateWithoutCurrencyInput> | TransactionCreateWithoutCurrencyInput[] | TransactionUncheckedCreateWithoutCurrencyInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutCurrencyInput | TransactionCreateOrConnectWithoutCurrencyInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutCurrencyInput | TransactionUpsertWithWhereUniqueWithoutCurrencyInput[]
    createMany?: TransactionCreateManyCurrencyInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutCurrencyInput | TransactionUpdateWithWhereUniqueWithoutCurrencyInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutCurrencyInput | TransactionUpdateManyWithWhereWithoutCurrencyInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type LedgerEntryUpdateManyWithoutCurrencyNestedInput = {
    create?: XOR<LedgerEntryCreateWithoutCurrencyInput, LedgerEntryUncheckedCreateWithoutCurrencyInput> | LedgerEntryCreateWithoutCurrencyInput[] | LedgerEntryUncheckedCreateWithoutCurrencyInput[]
    connectOrCreate?: LedgerEntryCreateOrConnectWithoutCurrencyInput | LedgerEntryCreateOrConnectWithoutCurrencyInput[]
    upsert?: LedgerEntryUpsertWithWhereUniqueWithoutCurrencyInput | LedgerEntryUpsertWithWhereUniqueWithoutCurrencyInput[]
    createMany?: LedgerEntryCreateManyCurrencyInputEnvelope
    set?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    disconnect?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    delete?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    connect?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    update?: LedgerEntryUpdateWithWhereUniqueWithoutCurrencyInput | LedgerEntryUpdateWithWhereUniqueWithoutCurrencyInput[]
    updateMany?: LedgerEntryUpdateManyWithWhereWithoutCurrencyInput | LedgerEntryUpdateManyWithWhereWithoutCurrencyInput[]
    deleteMany?: LedgerEntryScalarWhereInput | LedgerEntryScalarWhereInput[]
  }

  export type WalletBalanceUncheckedUpdateManyWithoutCurrencyNestedInput = {
    create?: XOR<WalletBalanceCreateWithoutCurrencyInput, WalletBalanceUncheckedCreateWithoutCurrencyInput> | WalletBalanceCreateWithoutCurrencyInput[] | WalletBalanceUncheckedCreateWithoutCurrencyInput[]
    connectOrCreate?: WalletBalanceCreateOrConnectWithoutCurrencyInput | WalletBalanceCreateOrConnectWithoutCurrencyInput[]
    upsert?: WalletBalanceUpsertWithWhereUniqueWithoutCurrencyInput | WalletBalanceUpsertWithWhereUniqueWithoutCurrencyInput[]
    createMany?: WalletBalanceCreateManyCurrencyInputEnvelope
    set?: WalletBalanceWhereUniqueInput | WalletBalanceWhereUniqueInput[]
    disconnect?: WalletBalanceWhereUniqueInput | WalletBalanceWhereUniqueInput[]
    delete?: WalletBalanceWhereUniqueInput | WalletBalanceWhereUniqueInput[]
    connect?: WalletBalanceWhereUniqueInput | WalletBalanceWhereUniqueInput[]
    update?: WalletBalanceUpdateWithWhereUniqueWithoutCurrencyInput | WalletBalanceUpdateWithWhereUniqueWithoutCurrencyInput[]
    updateMany?: WalletBalanceUpdateManyWithWhereWithoutCurrencyInput | WalletBalanceUpdateManyWithWhereWithoutCurrencyInput[]
    deleteMany?: WalletBalanceScalarWhereInput | WalletBalanceScalarWhereInput[]
  }

  export type DepositUncheckedUpdateManyWithoutCurrencyNestedInput = {
    create?: XOR<DepositCreateWithoutCurrencyInput, DepositUncheckedCreateWithoutCurrencyInput> | DepositCreateWithoutCurrencyInput[] | DepositUncheckedCreateWithoutCurrencyInput[]
    connectOrCreate?: DepositCreateOrConnectWithoutCurrencyInput | DepositCreateOrConnectWithoutCurrencyInput[]
    upsert?: DepositUpsertWithWhereUniqueWithoutCurrencyInput | DepositUpsertWithWhereUniqueWithoutCurrencyInput[]
    createMany?: DepositCreateManyCurrencyInputEnvelope
    set?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
    disconnect?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
    delete?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
    connect?: DepositWhereUniqueInput | DepositWhereUniqueInput[]
    update?: DepositUpdateWithWhereUniqueWithoutCurrencyInput | DepositUpdateWithWhereUniqueWithoutCurrencyInput[]
    updateMany?: DepositUpdateManyWithWhereWithoutCurrencyInput | DepositUpdateManyWithWhereWithoutCurrencyInput[]
    deleteMany?: DepositScalarWhereInput | DepositScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutCurrencyNestedInput = {
    create?: XOR<TransactionCreateWithoutCurrencyInput, TransactionUncheckedCreateWithoutCurrencyInput> | TransactionCreateWithoutCurrencyInput[] | TransactionUncheckedCreateWithoutCurrencyInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutCurrencyInput | TransactionCreateOrConnectWithoutCurrencyInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutCurrencyInput | TransactionUpsertWithWhereUniqueWithoutCurrencyInput[]
    createMany?: TransactionCreateManyCurrencyInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutCurrencyInput | TransactionUpdateWithWhereUniqueWithoutCurrencyInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutCurrencyInput | TransactionUpdateManyWithWhereWithoutCurrencyInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type LedgerEntryUncheckedUpdateManyWithoutCurrencyNestedInput = {
    create?: XOR<LedgerEntryCreateWithoutCurrencyInput, LedgerEntryUncheckedCreateWithoutCurrencyInput> | LedgerEntryCreateWithoutCurrencyInput[] | LedgerEntryUncheckedCreateWithoutCurrencyInput[]
    connectOrCreate?: LedgerEntryCreateOrConnectWithoutCurrencyInput | LedgerEntryCreateOrConnectWithoutCurrencyInput[]
    upsert?: LedgerEntryUpsertWithWhereUniqueWithoutCurrencyInput | LedgerEntryUpsertWithWhereUniqueWithoutCurrencyInput[]
    createMany?: LedgerEntryCreateManyCurrencyInputEnvelope
    set?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    disconnect?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    delete?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    connect?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    update?: LedgerEntryUpdateWithWhereUniqueWithoutCurrencyInput | LedgerEntryUpdateWithWhereUniqueWithoutCurrencyInput[]
    updateMany?: LedgerEntryUpdateManyWithWhereWithoutCurrencyInput | LedgerEntryUpdateManyWithWhereWithoutCurrencyInput[]
    deleteMany?: LedgerEntryScalarWhereInput | LedgerEntryScalarWhereInput[]
  }

  export type WalletCreateNestedOneWithoutBalancesInput = {
    create?: XOR<WalletCreateWithoutBalancesInput, WalletUncheckedCreateWithoutBalancesInput>
    connectOrCreate?: WalletCreateOrConnectWithoutBalancesInput
    connect?: WalletWhereUniqueInput
  }

  export type CurrencyCreateNestedOneWithoutBalancesInput = {
    create?: XOR<CurrencyCreateWithoutBalancesInput, CurrencyUncheckedCreateWithoutBalancesInput>
    connectOrCreate?: CurrencyCreateOrConnectWithoutBalancesInput
    connect?: CurrencyWhereUniqueInput
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type WalletUpdateOneRequiredWithoutBalancesNestedInput = {
    create?: XOR<WalletCreateWithoutBalancesInput, WalletUncheckedCreateWithoutBalancesInput>
    connectOrCreate?: WalletCreateOrConnectWithoutBalancesInput
    upsert?: WalletUpsertWithoutBalancesInput
    connect?: WalletWhereUniqueInput
    update?: XOR<XOR<WalletUpdateToOneWithWhereWithoutBalancesInput, WalletUpdateWithoutBalancesInput>, WalletUncheckedUpdateWithoutBalancesInput>
  }

  export type CurrencyUpdateOneRequiredWithoutBalancesNestedInput = {
    create?: XOR<CurrencyCreateWithoutBalancesInput, CurrencyUncheckedCreateWithoutBalancesInput>
    connectOrCreate?: CurrencyCreateOrConnectWithoutBalancesInput
    upsert?: CurrencyUpsertWithoutBalancesInput
    connect?: CurrencyWhereUniqueInput
    update?: XOR<XOR<CurrencyUpdateToOneWithWhereWithoutBalancesInput, CurrencyUpdateWithoutBalancesInput>, CurrencyUncheckedUpdateWithoutBalancesInput>
  }

  export type UserCreateNestedOneWithoutDepositsInput = {
    create?: XOR<UserCreateWithoutDepositsInput, UserUncheckedCreateWithoutDepositsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDepositsInput
    connect?: UserWhereUniqueInput
  }

  export type WalletCreateNestedOneWithoutDepositsInput = {
    create?: XOR<WalletCreateWithoutDepositsInput, WalletUncheckedCreateWithoutDepositsInput>
    connectOrCreate?: WalletCreateOrConnectWithoutDepositsInput
    connect?: WalletWhereUniqueInput
  }

  export type CurrencyCreateNestedOneWithoutDepositsInput = {
    create?: XOR<CurrencyCreateWithoutDepositsInput, CurrencyUncheckedCreateWithoutDepositsInput>
    connectOrCreate?: CurrencyCreateOrConnectWithoutDepositsInput
    connect?: CurrencyWhereUniqueInput
  }

  export type TransactionCreateNestedOneWithoutDepositInput = {
    create?: XOR<TransactionCreateWithoutDepositInput, TransactionUncheckedCreateWithoutDepositInput>
    connectOrCreate?: TransactionCreateOrConnectWithoutDepositInput
    connect?: TransactionWhereUniqueInput
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type EnumPaymentProviderFieldUpdateOperationsInput = {
    set?: $Enums.PaymentProvider
  }

  export type NullableEnumPaymentMethodFieldUpdateOperationsInput = {
    set?: $Enums.PaymentMethod | null
  }

  export type EnumDepositStatusFieldUpdateOperationsInput = {
    set?: $Enums.DepositStatus
  }

  export type UserUpdateOneRequiredWithoutDepositsNestedInput = {
    create?: XOR<UserCreateWithoutDepositsInput, UserUncheckedCreateWithoutDepositsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDepositsInput
    upsert?: UserUpsertWithoutDepositsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutDepositsInput, UserUpdateWithoutDepositsInput>, UserUncheckedUpdateWithoutDepositsInput>
  }

  export type WalletUpdateOneRequiredWithoutDepositsNestedInput = {
    create?: XOR<WalletCreateWithoutDepositsInput, WalletUncheckedCreateWithoutDepositsInput>
    connectOrCreate?: WalletCreateOrConnectWithoutDepositsInput
    upsert?: WalletUpsertWithoutDepositsInput
    connect?: WalletWhereUniqueInput
    update?: XOR<XOR<WalletUpdateToOneWithWhereWithoutDepositsInput, WalletUpdateWithoutDepositsInput>, WalletUncheckedUpdateWithoutDepositsInput>
  }

  export type CurrencyUpdateOneRequiredWithoutDepositsNestedInput = {
    create?: XOR<CurrencyCreateWithoutDepositsInput, CurrencyUncheckedCreateWithoutDepositsInput>
    connectOrCreate?: CurrencyCreateOrConnectWithoutDepositsInput
    upsert?: CurrencyUpsertWithoutDepositsInput
    connect?: CurrencyWhereUniqueInput
    update?: XOR<XOR<CurrencyUpdateToOneWithWhereWithoutDepositsInput, CurrencyUpdateWithoutDepositsInput>, CurrencyUncheckedUpdateWithoutDepositsInput>
  }

  export type TransactionUpdateOneWithoutDepositNestedInput = {
    create?: XOR<TransactionCreateWithoutDepositInput, TransactionUncheckedCreateWithoutDepositInput>
    connectOrCreate?: TransactionCreateOrConnectWithoutDepositInput
    upsert?: TransactionUpsertWithoutDepositInput
    disconnect?: TransactionWhereInput | boolean
    delete?: TransactionWhereInput | boolean
    connect?: TransactionWhereUniqueInput
    update?: XOR<XOR<TransactionUpdateToOneWithWhereWithoutDepositInput, TransactionUpdateWithoutDepositInput>, TransactionUncheckedUpdateWithoutDepositInput>
  }

  export type UserCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsInput
    connect?: UserWhereUniqueInput
  }

  export type WalletCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<WalletCreateWithoutTransactionsInput, WalletUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: WalletCreateOrConnectWithoutTransactionsInput
    connect?: WalletWhereUniqueInput
  }

  export type CurrencyCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<CurrencyCreateWithoutTransactionsInput, CurrencyUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: CurrencyCreateOrConnectWithoutTransactionsInput
    connect?: CurrencyWhereUniqueInput
  }

  export type DepositCreateNestedOneWithoutTransactionInput = {
    create?: XOR<DepositCreateWithoutTransactionInput, DepositUncheckedCreateWithoutTransactionInput>
    connectOrCreate?: DepositCreateOrConnectWithoutTransactionInput
    connect?: DepositWhereUniqueInput
  }

  export type LedgerEntryCreateNestedManyWithoutTransactionInput = {
    create?: XOR<LedgerEntryCreateWithoutTransactionInput, LedgerEntryUncheckedCreateWithoutTransactionInput> | LedgerEntryCreateWithoutTransactionInput[] | LedgerEntryUncheckedCreateWithoutTransactionInput[]
    connectOrCreate?: LedgerEntryCreateOrConnectWithoutTransactionInput | LedgerEntryCreateOrConnectWithoutTransactionInput[]
    createMany?: LedgerEntryCreateManyTransactionInputEnvelope
    connect?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
  }

  export type DepositUncheckedCreateNestedOneWithoutTransactionInput = {
    create?: XOR<DepositCreateWithoutTransactionInput, DepositUncheckedCreateWithoutTransactionInput>
    connectOrCreate?: DepositCreateOrConnectWithoutTransactionInput
    connect?: DepositWhereUniqueInput
  }

  export type LedgerEntryUncheckedCreateNestedManyWithoutTransactionInput = {
    create?: XOR<LedgerEntryCreateWithoutTransactionInput, LedgerEntryUncheckedCreateWithoutTransactionInput> | LedgerEntryCreateWithoutTransactionInput[] | LedgerEntryUncheckedCreateWithoutTransactionInput[]
    connectOrCreate?: LedgerEntryCreateOrConnectWithoutTransactionInput | LedgerEntryCreateOrConnectWithoutTransactionInput[]
    createMany?: LedgerEntryCreateManyTransactionInputEnvelope
    connect?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
  }

  export type EnumTransactionTypeFieldUpdateOperationsInput = {
    set?: $Enums.TransactionType
  }

  export type EnumTransactionStatusFieldUpdateOperationsInput = {
    set?: $Enums.TransactionStatus
  }

  export type NullableEnumPaymentProviderFieldUpdateOperationsInput = {
    set?: $Enums.PaymentProvider | null
  }

  export type UserUpdateOneRequiredWithoutTransactionsNestedInput = {
    create?: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsInput
    upsert?: UserUpsertWithoutTransactionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTransactionsInput, UserUpdateWithoutTransactionsInput>, UserUncheckedUpdateWithoutTransactionsInput>
  }

  export type WalletUpdateOneRequiredWithoutTransactionsNestedInput = {
    create?: XOR<WalletCreateWithoutTransactionsInput, WalletUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: WalletCreateOrConnectWithoutTransactionsInput
    upsert?: WalletUpsertWithoutTransactionsInput
    connect?: WalletWhereUniqueInput
    update?: XOR<XOR<WalletUpdateToOneWithWhereWithoutTransactionsInput, WalletUpdateWithoutTransactionsInput>, WalletUncheckedUpdateWithoutTransactionsInput>
  }

  export type CurrencyUpdateOneRequiredWithoutTransactionsNestedInput = {
    create?: XOR<CurrencyCreateWithoutTransactionsInput, CurrencyUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: CurrencyCreateOrConnectWithoutTransactionsInput
    upsert?: CurrencyUpsertWithoutTransactionsInput
    connect?: CurrencyWhereUniqueInput
    update?: XOR<XOR<CurrencyUpdateToOneWithWhereWithoutTransactionsInput, CurrencyUpdateWithoutTransactionsInput>, CurrencyUncheckedUpdateWithoutTransactionsInput>
  }

  export type DepositUpdateOneWithoutTransactionNestedInput = {
    create?: XOR<DepositCreateWithoutTransactionInput, DepositUncheckedCreateWithoutTransactionInput>
    connectOrCreate?: DepositCreateOrConnectWithoutTransactionInput
    upsert?: DepositUpsertWithoutTransactionInput
    disconnect?: DepositWhereInput | boolean
    delete?: DepositWhereInput | boolean
    connect?: DepositWhereUniqueInput
    update?: XOR<XOR<DepositUpdateToOneWithWhereWithoutTransactionInput, DepositUpdateWithoutTransactionInput>, DepositUncheckedUpdateWithoutTransactionInput>
  }

  export type LedgerEntryUpdateManyWithoutTransactionNestedInput = {
    create?: XOR<LedgerEntryCreateWithoutTransactionInput, LedgerEntryUncheckedCreateWithoutTransactionInput> | LedgerEntryCreateWithoutTransactionInput[] | LedgerEntryUncheckedCreateWithoutTransactionInput[]
    connectOrCreate?: LedgerEntryCreateOrConnectWithoutTransactionInput | LedgerEntryCreateOrConnectWithoutTransactionInput[]
    upsert?: LedgerEntryUpsertWithWhereUniqueWithoutTransactionInput | LedgerEntryUpsertWithWhereUniqueWithoutTransactionInput[]
    createMany?: LedgerEntryCreateManyTransactionInputEnvelope
    set?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    disconnect?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    delete?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    connect?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    update?: LedgerEntryUpdateWithWhereUniqueWithoutTransactionInput | LedgerEntryUpdateWithWhereUniqueWithoutTransactionInput[]
    updateMany?: LedgerEntryUpdateManyWithWhereWithoutTransactionInput | LedgerEntryUpdateManyWithWhereWithoutTransactionInput[]
    deleteMany?: LedgerEntryScalarWhereInput | LedgerEntryScalarWhereInput[]
  }

  export type DepositUncheckedUpdateOneWithoutTransactionNestedInput = {
    create?: XOR<DepositCreateWithoutTransactionInput, DepositUncheckedCreateWithoutTransactionInput>
    connectOrCreate?: DepositCreateOrConnectWithoutTransactionInput
    upsert?: DepositUpsertWithoutTransactionInput
    disconnect?: DepositWhereInput | boolean
    delete?: DepositWhereInput | boolean
    connect?: DepositWhereUniqueInput
    update?: XOR<XOR<DepositUpdateToOneWithWhereWithoutTransactionInput, DepositUpdateWithoutTransactionInput>, DepositUncheckedUpdateWithoutTransactionInput>
  }

  export type LedgerEntryUncheckedUpdateManyWithoutTransactionNestedInput = {
    create?: XOR<LedgerEntryCreateWithoutTransactionInput, LedgerEntryUncheckedCreateWithoutTransactionInput> | LedgerEntryCreateWithoutTransactionInput[] | LedgerEntryUncheckedCreateWithoutTransactionInput[]
    connectOrCreate?: LedgerEntryCreateOrConnectWithoutTransactionInput | LedgerEntryCreateOrConnectWithoutTransactionInput[]
    upsert?: LedgerEntryUpsertWithWhereUniqueWithoutTransactionInput | LedgerEntryUpsertWithWhereUniqueWithoutTransactionInput[]
    createMany?: LedgerEntryCreateManyTransactionInputEnvelope
    set?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    disconnect?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    delete?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    connect?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    update?: LedgerEntryUpdateWithWhereUniqueWithoutTransactionInput | LedgerEntryUpdateWithWhereUniqueWithoutTransactionInput[]
    updateMany?: LedgerEntryUpdateManyWithWhereWithoutTransactionInput | LedgerEntryUpdateManyWithWhereWithoutTransactionInput[]
    deleteMany?: LedgerEntryScalarWhereInput | LedgerEntryScalarWhereInput[]
  }

  export type WalletCreateNestedOneWithoutLedgerEntriesInput = {
    create?: XOR<WalletCreateWithoutLedgerEntriesInput, WalletUncheckedCreateWithoutLedgerEntriesInput>
    connectOrCreate?: WalletCreateOrConnectWithoutLedgerEntriesInput
    connect?: WalletWhereUniqueInput
  }

  export type CurrencyCreateNestedOneWithoutLedgerEntriesInput = {
    create?: XOR<CurrencyCreateWithoutLedgerEntriesInput, CurrencyUncheckedCreateWithoutLedgerEntriesInput>
    connectOrCreate?: CurrencyCreateOrConnectWithoutLedgerEntriesInput
    connect?: CurrencyWhereUniqueInput
  }

  export type TransactionCreateNestedOneWithoutLedgerEntriesInput = {
    create?: XOR<TransactionCreateWithoutLedgerEntriesInput, TransactionUncheckedCreateWithoutLedgerEntriesInput>
    connectOrCreate?: TransactionCreateOrConnectWithoutLedgerEntriesInput
    connect?: TransactionWhereUniqueInput
  }

  export type EnumLedgerEntryTypeFieldUpdateOperationsInput = {
    set?: $Enums.LedgerEntryType
  }

  export type WalletUpdateOneRequiredWithoutLedgerEntriesNestedInput = {
    create?: XOR<WalletCreateWithoutLedgerEntriesInput, WalletUncheckedCreateWithoutLedgerEntriesInput>
    connectOrCreate?: WalletCreateOrConnectWithoutLedgerEntriesInput
    upsert?: WalletUpsertWithoutLedgerEntriesInput
    connect?: WalletWhereUniqueInput
    update?: XOR<XOR<WalletUpdateToOneWithWhereWithoutLedgerEntriesInput, WalletUpdateWithoutLedgerEntriesInput>, WalletUncheckedUpdateWithoutLedgerEntriesInput>
  }

  export type CurrencyUpdateOneRequiredWithoutLedgerEntriesNestedInput = {
    create?: XOR<CurrencyCreateWithoutLedgerEntriesInput, CurrencyUncheckedCreateWithoutLedgerEntriesInput>
    connectOrCreate?: CurrencyCreateOrConnectWithoutLedgerEntriesInput
    upsert?: CurrencyUpsertWithoutLedgerEntriesInput
    connect?: CurrencyWhereUniqueInput
    update?: XOR<XOR<CurrencyUpdateToOneWithWhereWithoutLedgerEntriesInput, CurrencyUpdateWithoutLedgerEntriesInput>, CurrencyUncheckedUpdateWithoutLedgerEntriesInput>
  }

  export type TransactionUpdateOneWithoutLedgerEntriesNestedInput = {
    create?: XOR<TransactionCreateWithoutLedgerEntriesInput, TransactionUncheckedCreateWithoutLedgerEntriesInput>
    connectOrCreate?: TransactionCreateOrConnectWithoutLedgerEntriesInput
    upsert?: TransactionUpsertWithoutLedgerEntriesInput
    disconnect?: TransactionWhereInput | boolean
    delete?: TransactionWhereInput | boolean
    connect?: TransactionWhereUniqueInput
    update?: XOR<XOR<TransactionUpdateToOneWithWhereWithoutLedgerEntriesInput, TransactionUpdateWithoutLedgerEntriesInput>, TransactionUncheckedUpdateWithoutLedgerEntriesInput>
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

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedEnumPaymentProviderFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentProvider | EnumPaymentProviderFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentProviderFilter<$PrismaModel> | $Enums.PaymentProvider
  }

  export type NestedEnumPaymentMethodNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel> | null
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPaymentMethodNullableFilter<$PrismaModel> | $Enums.PaymentMethod | null
  }

  export type NestedEnumDepositStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DepositStatus | EnumDepositStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DepositStatus[] | ListEnumDepositStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DepositStatus[] | ListEnumDepositStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDepositStatusFilter<$PrismaModel> | $Enums.DepositStatus
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedEnumPaymentProviderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentProvider | EnumPaymentProviderFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentProviderWithAggregatesFilter<$PrismaModel> | $Enums.PaymentProvider
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentProviderFilter<$PrismaModel>
    _max?: NestedEnumPaymentProviderFilter<$PrismaModel>
  }

  export type NestedEnumPaymentMethodNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel> | null
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPaymentMethodNullableWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodNullableFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodNullableFilter<$PrismaModel>
  }

  export type NestedEnumDepositStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DepositStatus | EnumDepositStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DepositStatus[] | ListEnumDepositStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DepositStatus[] | ListEnumDepositStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDepositStatusWithAggregatesFilter<$PrismaModel> | $Enums.DepositStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDepositStatusFilter<$PrismaModel>
    _max?: NestedEnumDepositStatusFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumTransactionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionTypeFilter<$PrismaModel> | $Enums.TransactionType
  }

  export type NestedEnumTransactionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusFilter<$PrismaModel> | $Enums.TransactionStatus
  }

  export type NestedEnumPaymentProviderNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentProvider | EnumPaymentProviderFieldRefInput<$PrismaModel> | null
    in?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPaymentProviderNullableFilter<$PrismaModel> | $Enums.PaymentProvider | null
  }

  export type NestedEnumTransactionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionTypeWithAggregatesFilter<$PrismaModel> | $Enums.TransactionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionTypeFilter<$PrismaModel>
    _max?: NestedEnumTransactionTypeFilter<$PrismaModel>
  }

  export type NestedEnumTransactionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusWithAggregatesFilter<$PrismaModel> | $Enums.TransactionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionStatusFilter<$PrismaModel>
    _max?: NestedEnumTransactionStatusFilter<$PrismaModel>
  }

  export type NestedEnumPaymentProviderNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentProvider | EnumPaymentProviderFieldRefInput<$PrismaModel> | null
    in?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPaymentProviderNullableWithAggregatesFilter<$PrismaModel> | $Enums.PaymentProvider | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPaymentProviderNullableFilter<$PrismaModel>
    _max?: NestedEnumPaymentProviderNullableFilter<$PrismaModel>
  }

  export type NestedEnumLedgerEntryTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.LedgerEntryType | EnumLedgerEntryTypeFieldRefInput<$PrismaModel>
    in?: $Enums.LedgerEntryType[] | ListEnumLedgerEntryTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.LedgerEntryType[] | ListEnumLedgerEntryTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumLedgerEntryTypeFilter<$PrismaModel> | $Enums.LedgerEntryType
  }

  export type NestedEnumLedgerEntryTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LedgerEntryType | EnumLedgerEntryTypeFieldRefInput<$PrismaModel>
    in?: $Enums.LedgerEntryType[] | ListEnumLedgerEntryTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.LedgerEntryType[] | ListEnumLedgerEntryTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumLedgerEntryTypeWithAggregatesFilter<$PrismaModel> | $Enums.LedgerEntryType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLedgerEntryTypeFilter<$PrismaModel>
    _max?: NestedEnumLedgerEntryTypeFilter<$PrismaModel>
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

  export type WalletCreateWithoutUserInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    balances?: WalletBalanceCreateNestedManyWithoutWalletInput
    deposits?: DepositCreateNestedManyWithoutWalletInput
    transactions?: TransactionCreateNestedManyWithoutWalletInput
    ledgerEntries?: LedgerEntryCreateNestedManyWithoutWalletInput
  }

  export type WalletUncheckedCreateWithoutUserInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    balances?: WalletBalanceUncheckedCreateNestedManyWithoutWalletInput
    deposits?: DepositUncheckedCreateNestedManyWithoutWalletInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutWalletInput
    ledgerEntries?: LedgerEntryUncheckedCreateNestedManyWithoutWalletInput
  }

  export type WalletCreateOrConnectWithoutUserInput = {
    where: WalletWhereUniqueInput
    create: XOR<WalletCreateWithoutUserInput, WalletUncheckedCreateWithoutUserInput>
  }

  export type DepositCreateWithoutUserInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    exchangeRate?: Decimal | DecimalJsLike | number | string | null
    provider?: $Enums.PaymentProvider
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    country?: string | null
    countryCode?: string | null
    status?: $Enums.DepositStatus
    idempotencyKey?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    wallet: WalletCreateNestedOneWithoutDepositsInput
    currency: CurrencyCreateNestedOneWithoutDepositsInput
    transaction?: TransactionCreateNestedOneWithoutDepositInput
  }

  export type DepositUncheckedCreateWithoutUserInput = {
    id?: string
    walletId: string
    currencyCode: string
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    exchangeRate?: Decimal | DecimalJsLike | number | string | null
    provider?: $Enums.PaymentProvider
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    country?: string | null
    countryCode?: string | null
    status?: $Enums.DepositStatus
    idempotencyKey?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    transactionId?: string | null
  }

  export type DepositCreateOrConnectWithoutUserInput = {
    where: DepositWhereUniqueInput
    create: XOR<DepositCreateWithoutUserInput, DepositUncheckedCreateWithoutUserInput>
  }

  export type DepositCreateManyUserInputEnvelope = {
    data: DepositCreateManyUserInput | DepositCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TransactionCreateWithoutUserInput = {
    id?: string
    type?: $Enums.TransactionType
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.TransactionStatus
    provider?: $Enums.PaymentProvider | null
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    reference: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    wallet: WalletCreateNestedOneWithoutTransactionsInput
    currency: CurrencyCreateNestedOneWithoutTransactionsInput
    deposit?: DepositCreateNestedOneWithoutTransactionInput
    ledgerEntries?: LedgerEntryCreateNestedManyWithoutTransactionInput
  }

  export type TransactionUncheckedCreateWithoutUserInput = {
    id?: string
    walletId: string
    currencyCode: string
    type?: $Enums.TransactionType
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.TransactionStatus
    provider?: $Enums.PaymentProvider | null
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    reference: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    deposit?: DepositUncheckedCreateNestedOneWithoutTransactionInput
    ledgerEntries?: LedgerEntryUncheckedCreateNestedManyWithoutTransactionInput
  }

  export type TransactionCreateOrConnectWithoutUserInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput>
  }

  export type TransactionCreateManyUserInputEnvelope = {
    data: TransactionCreateManyUserInput | TransactionCreateManyUserInput[]
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

  export type WalletUpsertWithoutUserInput = {
    update: XOR<WalletUpdateWithoutUserInput, WalletUncheckedUpdateWithoutUserInput>
    create: XOR<WalletCreateWithoutUserInput, WalletUncheckedCreateWithoutUserInput>
    where?: WalletWhereInput
  }

  export type WalletUpdateToOneWithWhereWithoutUserInput = {
    where?: WalletWhereInput
    data: XOR<WalletUpdateWithoutUserInput, WalletUncheckedUpdateWithoutUserInput>
  }

  export type WalletUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    balances?: WalletBalanceUpdateManyWithoutWalletNestedInput
    deposits?: DepositUpdateManyWithoutWalletNestedInput
    transactions?: TransactionUpdateManyWithoutWalletNestedInput
    ledgerEntries?: LedgerEntryUpdateManyWithoutWalletNestedInput
  }

  export type WalletUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    balances?: WalletBalanceUncheckedUpdateManyWithoutWalletNestedInput
    deposits?: DepositUncheckedUpdateManyWithoutWalletNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutWalletNestedInput
    ledgerEntries?: LedgerEntryUncheckedUpdateManyWithoutWalletNestedInput
  }

  export type DepositUpsertWithWhereUniqueWithoutUserInput = {
    where: DepositWhereUniqueInput
    update: XOR<DepositUpdateWithoutUserInput, DepositUncheckedUpdateWithoutUserInput>
    create: XOR<DepositCreateWithoutUserInput, DepositUncheckedCreateWithoutUserInput>
  }

  export type DepositUpdateWithWhereUniqueWithoutUserInput = {
    where: DepositWhereUniqueInput
    data: XOR<DepositUpdateWithoutUserInput, DepositUncheckedUpdateWithoutUserInput>
  }

  export type DepositUpdateManyWithWhereWithoutUserInput = {
    where: DepositScalarWhereInput
    data: XOR<DepositUpdateManyMutationInput, DepositUncheckedUpdateManyWithoutUserInput>
  }

  export type DepositScalarWhereInput = {
    AND?: DepositScalarWhereInput | DepositScalarWhereInput[]
    OR?: DepositScalarWhereInput[]
    NOT?: DepositScalarWhereInput | DepositScalarWhereInput[]
    id?: StringFilter<"Deposit"> | string
    userId?: StringFilter<"Deposit"> | string
    walletId?: StringFilter<"Deposit"> | string
    currencyCode?: StringFilter<"Deposit"> | string
    amount?: DecimalFilter<"Deposit"> | Decimal | DecimalJsLike | number | string
    fee?: DecimalFilter<"Deposit"> | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFilter<"Deposit"> | Decimal | DecimalJsLike | number | string
    exchangeRate?: DecimalNullableFilter<"Deposit"> | Decimal | DecimalJsLike | number | string | null
    provider?: EnumPaymentProviderFilter<"Deposit"> | $Enums.PaymentProvider
    providerTransactionId?: StringNullableFilter<"Deposit"> | string | null
    providerReference?: StringNullableFilter<"Deposit"> | string | null
    paymentMethod?: EnumPaymentMethodNullableFilter<"Deposit"> | $Enums.PaymentMethod | null
    country?: StringNullableFilter<"Deposit"> | string | null
    countryCode?: StringNullableFilter<"Deposit"> | string | null
    status?: EnumDepositStatusFilter<"Deposit"> | $Enums.DepositStatus
    idempotencyKey?: StringNullableFilter<"Deposit"> | string | null
    metadata?: JsonNullableFilter<"Deposit">
    createdAt?: DateTimeFilter<"Deposit"> | Date | string
    updatedAt?: DateTimeFilter<"Deposit"> | Date | string
    transactionId?: StringNullableFilter<"Deposit"> | string | null
  }

  export type TransactionUpsertWithWhereUniqueWithoutUserInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutUserInput, TransactionUncheckedUpdateWithoutUserInput>
    create: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutUserInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutUserInput, TransactionUncheckedUpdateWithoutUserInput>
  }

  export type TransactionUpdateManyWithWhereWithoutUserInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutUserInput>
  }

  export type TransactionScalarWhereInput = {
    AND?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    OR?: TransactionScalarWhereInput[]
    NOT?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    id?: StringFilter<"Transaction"> | string
    userId?: StringFilter<"Transaction"> | string
    walletId?: StringFilter<"Transaction"> | string
    currencyCode?: StringFilter<"Transaction"> | string
    type?: EnumTransactionTypeFilter<"Transaction"> | $Enums.TransactionType
    amount?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    fee?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    status?: EnumTransactionStatusFilter<"Transaction"> | $Enums.TransactionStatus
    provider?: EnumPaymentProviderNullableFilter<"Transaction"> | $Enums.PaymentProvider | null
    providerTransactionId?: StringNullableFilter<"Transaction"> | string | null
    providerReference?: StringNullableFilter<"Transaction"> | string | null
    paymentMethod?: EnumPaymentMethodNullableFilter<"Transaction"> | $Enums.PaymentMethod | null
    reference?: StringFilter<"Transaction"> | string
    metadata?: JsonNullableFilter<"Transaction">
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeFilter<"Transaction"> | Date | string
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
    wallet?: WalletCreateNestedOneWithoutUserInput
    deposits?: DepositCreateNestedManyWithoutUserInput
    transactions?: TransactionCreateNestedManyWithoutUserInput
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
    wallet?: WalletUncheckedCreateNestedOneWithoutUserInput
    deposits?: DepositUncheckedCreateNestedManyWithoutUserInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
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
    wallet?: WalletUpdateOneWithoutUserNestedInput
    deposits?: DepositUpdateManyWithoutUserNestedInput
    transactions?: TransactionUpdateManyWithoutUserNestedInput
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
    wallet?: WalletUncheckedUpdateOneWithoutUserNestedInput
    deposits?: DepositUncheckedUpdateManyWithoutUserNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
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
    wallet?: WalletCreateNestedOneWithoutUserInput
    deposits?: DepositCreateNestedManyWithoutUserInput
    transactions?: TransactionCreateNestedManyWithoutUserInput
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
    wallet?: WalletUncheckedCreateNestedOneWithoutUserInput
    deposits?: DepositUncheckedCreateNestedManyWithoutUserInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
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
    wallet?: WalletUpdateOneWithoutUserNestedInput
    deposits?: DepositUpdateManyWithoutUserNestedInput
    transactions?: TransactionUpdateManyWithoutUserNestedInput
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
    wallet?: WalletUncheckedUpdateOneWithoutUserNestedInput
    deposits?: DepositUncheckedUpdateManyWithoutUserNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
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
    wallet?: WalletCreateNestedOneWithoutUserInput
    deposits?: DepositCreateNestedManyWithoutUserInput
    transactions?: TransactionCreateNestedManyWithoutUserInput
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
    wallet?: WalletUncheckedCreateNestedOneWithoutUserInput
    deposits?: DepositUncheckedCreateNestedManyWithoutUserInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
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
    wallet?: WalletUpdateOneWithoutUserNestedInput
    deposits?: DepositUpdateManyWithoutUserNestedInput
    transactions?: TransactionUpdateManyWithoutUserNestedInput
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
    wallet?: WalletUncheckedUpdateOneWithoutUserNestedInput
    deposits?: DepositUncheckedUpdateManyWithoutUserNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutWalletInput = {
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
    deposits?: DepositCreateNestedManyWithoutUserInput
    transactions?: TransactionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutWalletInput = {
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
    deposits?: DepositUncheckedCreateNestedManyWithoutUserInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutWalletInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWalletInput, UserUncheckedCreateWithoutWalletInput>
  }

  export type WalletBalanceCreateWithoutWalletInput = {
    id?: string
    availableBalance?: Decimal | DecimalJsLike | number | string
    pendingBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    currency: CurrencyCreateNestedOneWithoutBalancesInput
  }

  export type WalletBalanceUncheckedCreateWithoutWalletInput = {
    id?: string
    currencyCode: string
    availableBalance?: Decimal | DecimalJsLike | number | string
    pendingBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WalletBalanceCreateOrConnectWithoutWalletInput = {
    where: WalletBalanceWhereUniqueInput
    create: XOR<WalletBalanceCreateWithoutWalletInput, WalletBalanceUncheckedCreateWithoutWalletInput>
  }

  export type WalletBalanceCreateManyWalletInputEnvelope = {
    data: WalletBalanceCreateManyWalletInput | WalletBalanceCreateManyWalletInput[]
    skipDuplicates?: boolean
  }

  export type DepositCreateWithoutWalletInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    exchangeRate?: Decimal | DecimalJsLike | number | string | null
    provider?: $Enums.PaymentProvider
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    country?: string | null
    countryCode?: string | null
    status?: $Enums.DepositStatus
    idempotencyKey?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutDepositsInput
    currency: CurrencyCreateNestedOneWithoutDepositsInput
    transaction?: TransactionCreateNestedOneWithoutDepositInput
  }

  export type DepositUncheckedCreateWithoutWalletInput = {
    id?: string
    userId: string
    currencyCode: string
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    exchangeRate?: Decimal | DecimalJsLike | number | string | null
    provider?: $Enums.PaymentProvider
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    country?: string | null
    countryCode?: string | null
    status?: $Enums.DepositStatus
    idempotencyKey?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    transactionId?: string | null
  }

  export type DepositCreateOrConnectWithoutWalletInput = {
    where: DepositWhereUniqueInput
    create: XOR<DepositCreateWithoutWalletInput, DepositUncheckedCreateWithoutWalletInput>
  }

  export type DepositCreateManyWalletInputEnvelope = {
    data: DepositCreateManyWalletInput | DepositCreateManyWalletInput[]
    skipDuplicates?: boolean
  }

  export type TransactionCreateWithoutWalletInput = {
    id?: string
    type?: $Enums.TransactionType
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.TransactionStatus
    provider?: $Enums.PaymentProvider | null
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    reference: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTransactionsInput
    currency: CurrencyCreateNestedOneWithoutTransactionsInput
    deposit?: DepositCreateNestedOneWithoutTransactionInput
    ledgerEntries?: LedgerEntryCreateNestedManyWithoutTransactionInput
  }

  export type TransactionUncheckedCreateWithoutWalletInput = {
    id?: string
    userId: string
    currencyCode: string
    type?: $Enums.TransactionType
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.TransactionStatus
    provider?: $Enums.PaymentProvider | null
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    reference: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    deposit?: DepositUncheckedCreateNestedOneWithoutTransactionInput
    ledgerEntries?: LedgerEntryUncheckedCreateNestedManyWithoutTransactionInput
  }

  export type TransactionCreateOrConnectWithoutWalletInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutWalletInput, TransactionUncheckedCreateWithoutWalletInput>
  }

  export type TransactionCreateManyWalletInputEnvelope = {
    data: TransactionCreateManyWalletInput | TransactionCreateManyWalletInput[]
    skipDuplicates?: boolean
  }

  export type LedgerEntryCreateWithoutWalletInput = {
    id?: string
    type: $Enums.LedgerEntryType
    amount: Decimal | DecimalJsLike | number | string
    balanceBefore: Decimal | DecimalJsLike | number | string
    balanceAfter: Decimal | DecimalJsLike | number | string
    reference?: string | null
    reason?: string | null
    createdAt?: Date | string
    currency: CurrencyCreateNestedOneWithoutLedgerEntriesInput
    transaction?: TransactionCreateNestedOneWithoutLedgerEntriesInput
  }

  export type LedgerEntryUncheckedCreateWithoutWalletInput = {
    id?: string
    currencyCode: string
    transactionId?: string | null
    type: $Enums.LedgerEntryType
    amount: Decimal | DecimalJsLike | number | string
    balanceBefore: Decimal | DecimalJsLike | number | string
    balanceAfter: Decimal | DecimalJsLike | number | string
    reference?: string | null
    reason?: string | null
    createdAt?: Date | string
  }

  export type LedgerEntryCreateOrConnectWithoutWalletInput = {
    where: LedgerEntryWhereUniqueInput
    create: XOR<LedgerEntryCreateWithoutWalletInput, LedgerEntryUncheckedCreateWithoutWalletInput>
  }

  export type LedgerEntryCreateManyWalletInputEnvelope = {
    data: LedgerEntryCreateManyWalletInput | LedgerEntryCreateManyWalletInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutWalletInput = {
    update: XOR<UserUpdateWithoutWalletInput, UserUncheckedUpdateWithoutWalletInput>
    create: XOR<UserCreateWithoutWalletInput, UserUncheckedCreateWithoutWalletInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutWalletInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutWalletInput, UserUncheckedUpdateWithoutWalletInput>
  }

  export type UserUpdateWithoutWalletInput = {
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
    deposits?: DepositUpdateManyWithoutUserNestedInput
    transactions?: TransactionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutWalletInput = {
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
    deposits?: DepositUncheckedUpdateManyWithoutUserNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type WalletBalanceUpsertWithWhereUniqueWithoutWalletInput = {
    where: WalletBalanceWhereUniqueInput
    update: XOR<WalletBalanceUpdateWithoutWalletInput, WalletBalanceUncheckedUpdateWithoutWalletInput>
    create: XOR<WalletBalanceCreateWithoutWalletInput, WalletBalanceUncheckedCreateWithoutWalletInput>
  }

  export type WalletBalanceUpdateWithWhereUniqueWithoutWalletInput = {
    where: WalletBalanceWhereUniqueInput
    data: XOR<WalletBalanceUpdateWithoutWalletInput, WalletBalanceUncheckedUpdateWithoutWalletInput>
  }

  export type WalletBalanceUpdateManyWithWhereWithoutWalletInput = {
    where: WalletBalanceScalarWhereInput
    data: XOR<WalletBalanceUpdateManyMutationInput, WalletBalanceUncheckedUpdateManyWithoutWalletInput>
  }

  export type WalletBalanceScalarWhereInput = {
    AND?: WalletBalanceScalarWhereInput | WalletBalanceScalarWhereInput[]
    OR?: WalletBalanceScalarWhereInput[]
    NOT?: WalletBalanceScalarWhereInput | WalletBalanceScalarWhereInput[]
    id?: StringFilter<"WalletBalance"> | string
    walletId?: StringFilter<"WalletBalance"> | string
    currencyCode?: StringFilter<"WalletBalance"> | string
    availableBalance?: DecimalFilter<"WalletBalance"> | Decimal | DecimalJsLike | number | string
    pendingBalance?: DecimalFilter<"WalletBalance"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"WalletBalance"> | Date | string
    updatedAt?: DateTimeFilter<"WalletBalance"> | Date | string
  }

  export type DepositUpsertWithWhereUniqueWithoutWalletInput = {
    where: DepositWhereUniqueInput
    update: XOR<DepositUpdateWithoutWalletInput, DepositUncheckedUpdateWithoutWalletInput>
    create: XOR<DepositCreateWithoutWalletInput, DepositUncheckedCreateWithoutWalletInput>
  }

  export type DepositUpdateWithWhereUniqueWithoutWalletInput = {
    where: DepositWhereUniqueInput
    data: XOR<DepositUpdateWithoutWalletInput, DepositUncheckedUpdateWithoutWalletInput>
  }

  export type DepositUpdateManyWithWhereWithoutWalletInput = {
    where: DepositScalarWhereInput
    data: XOR<DepositUpdateManyMutationInput, DepositUncheckedUpdateManyWithoutWalletInput>
  }

  export type TransactionUpsertWithWhereUniqueWithoutWalletInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutWalletInput, TransactionUncheckedUpdateWithoutWalletInput>
    create: XOR<TransactionCreateWithoutWalletInput, TransactionUncheckedCreateWithoutWalletInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutWalletInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutWalletInput, TransactionUncheckedUpdateWithoutWalletInput>
  }

  export type TransactionUpdateManyWithWhereWithoutWalletInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutWalletInput>
  }

  export type LedgerEntryUpsertWithWhereUniqueWithoutWalletInput = {
    where: LedgerEntryWhereUniqueInput
    update: XOR<LedgerEntryUpdateWithoutWalletInput, LedgerEntryUncheckedUpdateWithoutWalletInput>
    create: XOR<LedgerEntryCreateWithoutWalletInput, LedgerEntryUncheckedCreateWithoutWalletInput>
  }

  export type LedgerEntryUpdateWithWhereUniqueWithoutWalletInput = {
    where: LedgerEntryWhereUniqueInput
    data: XOR<LedgerEntryUpdateWithoutWalletInput, LedgerEntryUncheckedUpdateWithoutWalletInput>
  }

  export type LedgerEntryUpdateManyWithWhereWithoutWalletInput = {
    where: LedgerEntryScalarWhereInput
    data: XOR<LedgerEntryUpdateManyMutationInput, LedgerEntryUncheckedUpdateManyWithoutWalletInput>
  }

  export type LedgerEntryScalarWhereInput = {
    AND?: LedgerEntryScalarWhereInput | LedgerEntryScalarWhereInput[]
    OR?: LedgerEntryScalarWhereInput[]
    NOT?: LedgerEntryScalarWhereInput | LedgerEntryScalarWhereInput[]
    id?: StringFilter<"LedgerEntry"> | string
    walletId?: StringFilter<"LedgerEntry"> | string
    currencyCode?: StringFilter<"LedgerEntry"> | string
    transactionId?: StringNullableFilter<"LedgerEntry"> | string | null
    type?: EnumLedgerEntryTypeFilter<"LedgerEntry"> | $Enums.LedgerEntryType
    amount?: DecimalFilter<"LedgerEntry"> | Decimal | DecimalJsLike | number | string
    balanceBefore?: DecimalFilter<"LedgerEntry"> | Decimal | DecimalJsLike | number | string
    balanceAfter?: DecimalFilter<"LedgerEntry"> | Decimal | DecimalJsLike | number | string
    reference?: StringNullableFilter<"LedgerEntry"> | string | null
    reason?: StringNullableFilter<"LedgerEntry"> | string | null
    createdAt?: DateTimeFilter<"LedgerEntry"> | Date | string
  }

  export type WalletBalanceCreateWithoutCurrencyInput = {
    id?: string
    availableBalance?: Decimal | DecimalJsLike | number | string
    pendingBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    wallet: WalletCreateNestedOneWithoutBalancesInput
  }

  export type WalletBalanceUncheckedCreateWithoutCurrencyInput = {
    id?: string
    walletId: string
    availableBalance?: Decimal | DecimalJsLike | number | string
    pendingBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WalletBalanceCreateOrConnectWithoutCurrencyInput = {
    where: WalletBalanceWhereUniqueInput
    create: XOR<WalletBalanceCreateWithoutCurrencyInput, WalletBalanceUncheckedCreateWithoutCurrencyInput>
  }

  export type WalletBalanceCreateManyCurrencyInputEnvelope = {
    data: WalletBalanceCreateManyCurrencyInput | WalletBalanceCreateManyCurrencyInput[]
    skipDuplicates?: boolean
  }

  export type DepositCreateWithoutCurrencyInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    exchangeRate?: Decimal | DecimalJsLike | number | string | null
    provider?: $Enums.PaymentProvider
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    country?: string | null
    countryCode?: string | null
    status?: $Enums.DepositStatus
    idempotencyKey?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutDepositsInput
    wallet: WalletCreateNestedOneWithoutDepositsInput
    transaction?: TransactionCreateNestedOneWithoutDepositInput
  }

  export type DepositUncheckedCreateWithoutCurrencyInput = {
    id?: string
    userId: string
    walletId: string
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    exchangeRate?: Decimal | DecimalJsLike | number | string | null
    provider?: $Enums.PaymentProvider
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    country?: string | null
    countryCode?: string | null
    status?: $Enums.DepositStatus
    idempotencyKey?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    transactionId?: string | null
  }

  export type DepositCreateOrConnectWithoutCurrencyInput = {
    where: DepositWhereUniqueInput
    create: XOR<DepositCreateWithoutCurrencyInput, DepositUncheckedCreateWithoutCurrencyInput>
  }

  export type DepositCreateManyCurrencyInputEnvelope = {
    data: DepositCreateManyCurrencyInput | DepositCreateManyCurrencyInput[]
    skipDuplicates?: boolean
  }

  export type TransactionCreateWithoutCurrencyInput = {
    id?: string
    type?: $Enums.TransactionType
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.TransactionStatus
    provider?: $Enums.PaymentProvider | null
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    reference: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTransactionsInput
    wallet: WalletCreateNestedOneWithoutTransactionsInput
    deposit?: DepositCreateNestedOneWithoutTransactionInput
    ledgerEntries?: LedgerEntryCreateNestedManyWithoutTransactionInput
  }

  export type TransactionUncheckedCreateWithoutCurrencyInput = {
    id?: string
    userId: string
    walletId: string
    type?: $Enums.TransactionType
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.TransactionStatus
    provider?: $Enums.PaymentProvider | null
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    reference: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    deposit?: DepositUncheckedCreateNestedOneWithoutTransactionInput
    ledgerEntries?: LedgerEntryUncheckedCreateNestedManyWithoutTransactionInput
  }

  export type TransactionCreateOrConnectWithoutCurrencyInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutCurrencyInput, TransactionUncheckedCreateWithoutCurrencyInput>
  }

  export type TransactionCreateManyCurrencyInputEnvelope = {
    data: TransactionCreateManyCurrencyInput | TransactionCreateManyCurrencyInput[]
    skipDuplicates?: boolean
  }

  export type LedgerEntryCreateWithoutCurrencyInput = {
    id?: string
    type: $Enums.LedgerEntryType
    amount: Decimal | DecimalJsLike | number | string
    balanceBefore: Decimal | DecimalJsLike | number | string
    balanceAfter: Decimal | DecimalJsLike | number | string
    reference?: string | null
    reason?: string | null
    createdAt?: Date | string
    wallet: WalletCreateNestedOneWithoutLedgerEntriesInput
    transaction?: TransactionCreateNestedOneWithoutLedgerEntriesInput
  }

  export type LedgerEntryUncheckedCreateWithoutCurrencyInput = {
    id?: string
    walletId: string
    transactionId?: string | null
    type: $Enums.LedgerEntryType
    amount: Decimal | DecimalJsLike | number | string
    balanceBefore: Decimal | DecimalJsLike | number | string
    balanceAfter: Decimal | DecimalJsLike | number | string
    reference?: string | null
    reason?: string | null
    createdAt?: Date | string
  }

  export type LedgerEntryCreateOrConnectWithoutCurrencyInput = {
    where: LedgerEntryWhereUniqueInput
    create: XOR<LedgerEntryCreateWithoutCurrencyInput, LedgerEntryUncheckedCreateWithoutCurrencyInput>
  }

  export type LedgerEntryCreateManyCurrencyInputEnvelope = {
    data: LedgerEntryCreateManyCurrencyInput | LedgerEntryCreateManyCurrencyInput[]
    skipDuplicates?: boolean
  }

  export type WalletBalanceUpsertWithWhereUniqueWithoutCurrencyInput = {
    where: WalletBalanceWhereUniqueInput
    update: XOR<WalletBalanceUpdateWithoutCurrencyInput, WalletBalanceUncheckedUpdateWithoutCurrencyInput>
    create: XOR<WalletBalanceCreateWithoutCurrencyInput, WalletBalanceUncheckedCreateWithoutCurrencyInput>
  }

  export type WalletBalanceUpdateWithWhereUniqueWithoutCurrencyInput = {
    where: WalletBalanceWhereUniqueInput
    data: XOR<WalletBalanceUpdateWithoutCurrencyInput, WalletBalanceUncheckedUpdateWithoutCurrencyInput>
  }

  export type WalletBalanceUpdateManyWithWhereWithoutCurrencyInput = {
    where: WalletBalanceScalarWhereInput
    data: XOR<WalletBalanceUpdateManyMutationInput, WalletBalanceUncheckedUpdateManyWithoutCurrencyInput>
  }

  export type DepositUpsertWithWhereUniqueWithoutCurrencyInput = {
    where: DepositWhereUniqueInput
    update: XOR<DepositUpdateWithoutCurrencyInput, DepositUncheckedUpdateWithoutCurrencyInput>
    create: XOR<DepositCreateWithoutCurrencyInput, DepositUncheckedCreateWithoutCurrencyInput>
  }

  export type DepositUpdateWithWhereUniqueWithoutCurrencyInput = {
    where: DepositWhereUniqueInput
    data: XOR<DepositUpdateWithoutCurrencyInput, DepositUncheckedUpdateWithoutCurrencyInput>
  }

  export type DepositUpdateManyWithWhereWithoutCurrencyInput = {
    where: DepositScalarWhereInput
    data: XOR<DepositUpdateManyMutationInput, DepositUncheckedUpdateManyWithoutCurrencyInput>
  }

  export type TransactionUpsertWithWhereUniqueWithoutCurrencyInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutCurrencyInput, TransactionUncheckedUpdateWithoutCurrencyInput>
    create: XOR<TransactionCreateWithoutCurrencyInput, TransactionUncheckedCreateWithoutCurrencyInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutCurrencyInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutCurrencyInput, TransactionUncheckedUpdateWithoutCurrencyInput>
  }

  export type TransactionUpdateManyWithWhereWithoutCurrencyInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutCurrencyInput>
  }

  export type LedgerEntryUpsertWithWhereUniqueWithoutCurrencyInput = {
    where: LedgerEntryWhereUniqueInput
    update: XOR<LedgerEntryUpdateWithoutCurrencyInput, LedgerEntryUncheckedUpdateWithoutCurrencyInput>
    create: XOR<LedgerEntryCreateWithoutCurrencyInput, LedgerEntryUncheckedCreateWithoutCurrencyInput>
  }

  export type LedgerEntryUpdateWithWhereUniqueWithoutCurrencyInput = {
    where: LedgerEntryWhereUniqueInput
    data: XOR<LedgerEntryUpdateWithoutCurrencyInput, LedgerEntryUncheckedUpdateWithoutCurrencyInput>
  }

  export type LedgerEntryUpdateManyWithWhereWithoutCurrencyInput = {
    where: LedgerEntryScalarWhereInput
    data: XOR<LedgerEntryUpdateManyMutationInput, LedgerEntryUncheckedUpdateManyWithoutCurrencyInput>
  }

  export type WalletCreateWithoutBalancesInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutWalletInput
    deposits?: DepositCreateNestedManyWithoutWalletInput
    transactions?: TransactionCreateNestedManyWithoutWalletInput
    ledgerEntries?: LedgerEntryCreateNestedManyWithoutWalletInput
  }

  export type WalletUncheckedCreateWithoutBalancesInput = {
    id?: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deposits?: DepositUncheckedCreateNestedManyWithoutWalletInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutWalletInput
    ledgerEntries?: LedgerEntryUncheckedCreateNestedManyWithoutWalletInput
  }

  export type WalletCreateOrConnectWithoutBalancesInput = {
    where: WalletWhereUniqueInput
    create: XOR<WalletCreateWithoutBalancesInput, WalletUncheckedCreateWithoutBalancesInput>
  }

  export type CurrencyCreateWithoutBalancesInput = {
    code: string
    name: string
    symbol?: string | null
    country?: string | null
    region?: string | null
    flag?: string | null
    enabled?: boolean
    depositEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deposits?: DepositCreateNestedManyWithoutCurrencyInput
    transactions?: TransactionCreateNestedManyWithoutCurrencyInput
    ledgerEntries?: LedgerEntryCreateNestedManyWithoutCurrencyInput
  }

  export type CurrencyUncheckedCreateWithoutBalancesInput = {
    code: string
    name: string
    symbol?: string | null
    country?: string | null
    region?: string | null
    flag?: string | null
    enabled?: boolean
    depositEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deposits?: DepositUncheckedCreateNestedManyWithoutCurrencyInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutCurrencyInput
    ledgerEntries?: LedgerEntryUncheckedCreateNestedManyWithoutCurrencyInput
  }

  export type CurrencyCreateOrConnectWithoutBalancesInput = {
    where: CurrencyWhereUniqueInput
    create: XOR<CurrencyCreateWithoutBalancesInput, CurrencyUncheckedCreateWithoutBalancesInput>
  }

  export type WalletUpsertWithoutBalancesInput = {
    update: XOR<WalletUpdateWithoutBalancesInput, WalletUncheckedUpdateWithoutBalancesInput>
    create: XOR<WalletCreateWithoutBalancesInput, WalletUncheckedCreateWithoutBalancesInput>
    where?: WalletWhereInput
  }

  export type WalletUpdateToOneWithWhereWithoutBalancesInput = {
    where?: WalletWhereInput
    data: XOR<WalletUpdateWithoutBalancesInput, WalletUncheckedUpdateWithoutBalancesInput>
  }

  export type WalletUpdateWithoutBalancesInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutWalletNestedInput
    deposits?: DepositUpdateManyWithoutWalletNestedInput
    transactions?: TransactionUpdateManyWithoutWalletNestedInput
    ledgerEntries?: LedgerEntryUpdateManyWithoutWalletNestedInput
  }

  export type WalletUncheckedUpdateWithoutBalancesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deposits?: DepositUncheckedUpdateManyWithoutWalletNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutWalletNestedInput
    ledgerEntries?: LedgerEntryUncheckedUpdateManyWithoutWalletNestedInput
  }

  export type CurrencyUpsertWithoutBalancesInput = {
    update: XOR<CurrencyUpdateWithoutBalancesInput, CurrencyUncheckedUpdateWithoutBalancesInput>
    create: XOR<CurrencyCreateWithoutBalancesInput, CurrencyUncheckedCreateWithoutBalancesInput>
    where?: CurrencyWhereInput
  }

  export type CurrencyUpdateToOneWithWhereWithoutBalancesInput = {
    where?: CurrencyWhereInput
    data: XOR<CurrencyUpdateWithoutBalancesInput, CurrencyUncheckedUpdateWithoutBalancesInput>
  }

  export type CurrencyUpdateWithoutBalancesInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    symbol?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: BoolFieldUpdateOperationsInput | boolean
    depositEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deposits?: DepositUpdateManyWithoutCurrencyNestedInput
    transactions?: TransactionUpdateManyWithoutCurrencyNestedInput
    ledgerEntries?: LedgerEntryUpdateManyWithoutCurrencyNestedInput
  }

  export type CurrencyUncheckedUpdateWithoutBalancesInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    symbol?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: BoolFieldUpdateOperationsInput | boolean
    depositEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deposits?: DepositUncheckedUpdateManyWithoutCurrencyNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutCurrencyNestedInput
    ledgerEntries?: LedgerEntryUncheckedUpdateManyWithoutCurrencyNestedInput
  }

  export type UserCreateWithoutDepositsInput = {
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
    wallet?: WalletCreateNestedOneWithoutUserInput
    transactions?: TransactionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutDepositsInput = {
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
    wallet?: WalletUncheckedCreateNestedOneWithoutUserInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutDepositsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDepositsInput, UserUncheckedCreateWithoutDepositsInput>
  }

  export type WalletCreateWithoutDepositsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutWalletInput
    balances?: WalletBalanceCreateNestedManyWithoutWalletInput
    transactions?: TransactionCreateNestedManyWithoutWalletInput
    ledgerEntries?: LedgerEntryCreateNestedManyWithoutWalletInput
  }

  export type WalletUncheckedCreateWithoutDepositsInput = {
    id?: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    balances?: WalletBalanceUncheckedCreateNestedManyWithoutWalletInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutWalletInput
    ledgerEntries?: LedgerEntryUncheckedCreateNestedManyWithoutWalletInput
  }

  export type WalletCreateOrConnectWithoutDepositsInput = {
    where: WalletWhereUniqueInput
    create: XOR<WalletCreateWithoutDepositsInput, WalletUncheckedCreateWithoutDepositsInput>
  }

  export type CurrencyCreateWithoutDepositsInput = {
    code: string
    name: string
    symbol?: string | null
    country?: string | null
    region?: string | null
    flag?: string | null
    enabled?: boolean
    depositEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    balances?: WalletBalanceCreateNestedManyWithoutCurrencyInput
    transactions?: TransactionCreateNestedManyWithoutCurrencyInput
    ledgerEntries?: LedgerEntryCreateNestedManyWithoutCurrencyInput
  }

  export type CurrencyUncheckedCreateWithoutDepositsInput = {
    code: string
    name: string
    symbol?: string | null
    country?: string | null
    region?: string | null
    flag?: string | null
    enabled?: boolean
    depositEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    balances?: WalletBalanceUncheckedCreateNestedManyWithoutCurrencyInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutCurrencyInput
    ledgerEntries?: LedgerEntryUncheckedCreateNestedManyWithoutCurrencyInput
  }

  export type CurrencyCreateOrConnectWithoutDepositsInput = {
    where: CurrencyWhereUniqueInput
    create: XOR<CurrencyCreateWithoutDepositsInput, CurrencyUncheckedCreateWithoutDepositsInput>
  }

  export type TransactionCreateWithoutDepositInput = {
    id?: string
    type?: $Enums.TransactionType
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.TransactionStatus
    provider?: $Enums.PaymentProvider | null
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    reference: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTransactionsInput
    wallet: WalletCreateNestedOneWithoutTransactionsInput
    currency: CurrencyCreateNestedOneWithoutTransactionsInput
    ledgerEntries?: LedgerEntryCreateNestedManyWithoutTransactionInput
  }

  export type TransactionUncheckedCreateWithoutDepositInput = {
    id?: string
    userId: string
    walletId: string
    currencyCode: string
    type?: $Enums.TransactionType
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.TransactionStatus
    provider?: $Enums.PaymentProvider | null
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    reference: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    ledgerEntries?: LedgerEntryUncheckedCreateNestedManyWithoutTransactionInput
  }

  export type TransactionCreateOrConnectWithoutDepositInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutDepositInput, TransactionUncheckedCreateWithoutDepositInput>
  }

  export type UserUpsertWithoutDepositsInput = {
    update: XOR<UserUpdateWithoutDepositsInput, UserUncheckedUpdateWithoutDepositsInput>
    create: XOR<UserCreateWithoutDepositsInput, UserUncheckedCreateWithoutDepositsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutDepositsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutDepositsInput, UserUncheckedUpdateWithoutDepositsInput>
  }

  export type UserUpdateWithoutDepositsInput = {
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
    wallet?: WalletUpdateOneWithoutUserNestedInput
    transactions?: TransactionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutDepositsInput = {
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
    wallet?: WalletUncheckedUpdateOneWithoutUserNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type WalletUpsertWithoutDepositsInput = {
    update: XOR<WalletUpdateWithoutDepositsInput, WalletUncheckedUpdateWithoutDepositsInput>
    create: XOR<WalletCreateWithoutDepositsInput, WalletUncheckedCreateWithoutDepositsInput>
    where?: WalletWhereInput
  }

  export type WalletUpdateToOneWithWhereWithoutDepositsInput = {
    where?: WalletWhereInput
    data: XOR<WalletUpdateWithoutDepositsInput, WalletUncheckedUpdateWithoutDepositsInput>
  }

  export type WalletUpdateWithoutDepositsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutWalletNestedInput
    balances?: WalletBalanceUpdateManyWithoutWalletNestedInput
    transactions?: TransactionUpdateManyWithoutWalletNestedInput
    ledgerEntries?: LedgerEntryUpdateManyWithoutWalletNestedInput
  }

  export type WalletUncheckedUpdateWithoutDepositsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    balances?: WalletBalanceUncheckedUpdateManyWithoutWalletNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutWalletNestedInput
    ledgerEntries?: LedgerEntryUncheckedUpdateManyWithoutWalletNestedInput
  }

  export type CurrencyUpsertWithoutDepositsInput = {
    update: XOR<CurrencyUpdateWithoutDepositsInput, CurrencyUncheckedUpdateWithoutDepositsInput>
    create: XOR<CurrencyCreateWithoutDepositsInput, CurrencyUncheckedCreateWithoutDepositsInput>
    where?: CurrencyWhereInput
  }

  export type CurrencyUpdateToOneWithWhereWithoutDepositsInput = {
    where?: CurrencyWhereInput
    data: XOR<CurrencyUpdateWithoutDepositsInput, CurrencyUncheckedUpdateWithoutDepositsInput>
  }

  export type CurrencyUpdateWithoutDepositsInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    symbol?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: BoolFieldUpdateOperationsInput | boolean
    depositEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    balances?: WalletBalanceUpdateManyWithoutCurrencyNestedInput
    transactions?: TransactionUpdateManyWithoutCurrencyNestedInput
    ledgerEntries?: LedgerEntryUpdateManyWithoutCurrencyNestedInput
  }

  export type CurrencyUncheckedUpdateWithoutDepositsInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    symbol?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: BoolFieldUpdateOperationsInput | boolean
    depositEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    balances?: WalletBalanceUncheckedUpdateManyWithoutCurrencyNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutCurrencyNestedInput
    ledgerEntries?: LedgerEntryUncheckedUpdateManyWithoutCurrencyNestedInput
  }

  export type TransactionUpsertWithoutDepositInput = {
    update: XOR<TransactionUpdateWithoutDepositInput, TransactionUncheckedUpdateWithoutDepositInput>
    create: XOR<TransactionCreateWithoutDepositInput, TransactionUncheckedCreateWithoutDepositInput>
    where?: TransactionWhereInput
  }

  export type TransactionUpdateToOneWithWhereWithoutDepositInput = {
    where?: TransactionWhereInput
    data: XOR<TransactionUpdateWithoutDepositInput, TransactionUncheckedUpdateWithoutDepositInput>
  }

  export type TransactionUpdateWithoutDepositInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    provider?: NullableEnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider | null
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTransactionsNestedInput
    wallet?: WalletUpdateOneRequiredWithoutTransactionsNestedInput
    currency?: CurrencyUpdateOneRequiredWithoutTransactionsNestedInput
    ledgerEntries?: LedgerEntryUpdateManyWithoutTransactionNestedInput
  }

  export type TransactionUncheckedUpdateWithoutDepositInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    provider?: NullableEnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider | null
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ledgerEntries?: LedgerEntryUncheckedUpdateManyWithoutTransactionNestedInput
  }

  export type UserCreateWithoutTransactionsInput = {
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
    wallet?: WalletCreateNestedOneWithoutUserInput
    deposits?: DepositCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTransactionsInput = {
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
    wallet?: WalletUncheckedCreateNestedOneWithoutUserInput
    deposits?: DepositUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTransactionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>
  }

  export type WalletCreateWithoutTransactionsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutWalletInput
    balances?: WalletBalanceCreateNestedManyWithoutWalletInput
    deposits?: DepositCreateNestedManyWithoutWalletInput
    ledgerEntries?: LedgerEntryCreateNestedManyWithoutWalletInput
  }

  export type WalletUncheckedCreateWithoutTransactionsInput = {
    id?: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    balances?: WalletBalanceUncheckedCreateNestedManyWithoutWalletInput
    deposits?: DepositUncheckedCreateNestedManyWithoutWalletInput
    ledgerEntries?: LedgerEntryUncheckedCreateNestedManyWithoutWalletInput
  }

  export type WalletCreateOrConnectWithoutTransactionsInput = {
    where: WalletWhereUniqueInput
    create: XOR<WalletCreateWithoutTransactionsInput, WalletUncheckedCreateWithoutTransactionsInput>
  }

  export type CurrencyCreateWithoutTransactionsInput = {
    code: string
    name: string
    symbol?: string | null
    country?: string | null
    region?: string | null
    flag?: string | null
    enabled?: boolean
    depositEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    balances?: WalletBalanceCreateNestedManyWithoutCurrencyInput
    deposits?: DepositCreateNestedManyWithoutCurrencyInput
    ledgerEntries?: LedgerEntryCreateNestedManyWithoutCurrencyInput
  }

  export type CurrencyUncheckedCreateWithoutTransactionsInput = {
    code: string
    name: string
    symbol?: string | null
    country?: string | null
    region?: string | null
    flag?: string | null
    enabled?: boolean
    depositEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    balances?: WalletBalanceUncheckedCreateNestedManyWithoutCurrencyInput
    deposits?: DepositUncheckedCreateNestedManyWithoutCurrencyInput
    ledgerEntries?: LedgerEntryUncheckedCreateNestedManyWithoutCurrencyInput
  }

  export type CurrencyCreateOrConnectWithoutTransactionsInput = {
    where: CurrencyWhereUniqueInput
    create: XOR<CurrencyCreateWithoutTransactionsInput, CurrencyUncheckedCreateWithoutTransactionsInput>
  }

  export type DepositCreateWithoutTransactionInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    exchangeRate?: Decimal | DecimalJsLike | number | string | null
    provider?: $Enums.PaymentProvider
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    country?: string | null
    countryCode?: string | null
    status?: $Enums.DepositStatus
    idempotencyKey?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutDepositsInput
    wallet: WalletCreateNestedOneWithoutDepositsInput
    currency: CurrencyCreateNestedOneWithoutDepositsInput
  }

  export type DepositUncheckedCreateWithoutTransactionInput = {
    id?: string
    userId: string
    walletId: string
    currencyCode: string
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    exchangeRate?: Decimal | DecimalJsLike | number | string | null
    provider?: $Enums.PaymentProvider
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    country?: string | null
    countryCode?: string | null
    status?: $Enums.DepositStatus
    idempotencyKey?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DepositCreateOrConnectWithoutTransactionInput = {
    where: DepositWhereUniqueInput
    create: XOR<DepositCreateWithoutTransactionInput, DepositUncheckedCreateWithoutTransactionInput>
  }

  export type LedgerEntryCreateWithoutTransactionInput = {
    id?: string
    type: $Enums.LedgerEntryType
    amount: Decimal | DecimalJsLike | number | string
    balanceBefore: Decimal | DecimalJsLike | number | string
    balanceAfter: Decimal | DecimalJsLike | number | string
    reference?: string | null
    reason?: string | null
    createdAt?: Date | string
    wallet: WalletCreateNestedOneWithoutLedgerEntriesInput
    currency: CurrencyCreateNestedOneWithoutLedgerEntriesInput
  }

  export type LedgerEntryUncheckedCreateWithoutTransactionInput = {
    id?: string
    walletId: string
    currencyCode: string
    type: $Enums.LedgerEntryType
    amount: Decimal | DecimalJsLike | number | string
    balanceBefore: Decimal | DecimalJsLike | number | string
    balanceAfter: Decimal | DecimalJsLike | number | string
    reference?: string | null
    reason?: string | null
    createdAt?: Date | string
  }

  export type LedgerEntryCreateOrConnectWithoutTransactionInput = {
    where: LedgerEntryWhereUniqueInput
    create: XOR<LedgerEntryCreateWithoutTransactionInput, LedgerEntryUncheckedCreateWithoutTransactionInput>
  }

  export type LedgerEntryCreateManyTransactionInputEnvelope = {
    data: LedgerEntryCreateManyTransactionInput | LedgerEntryCreateManyTransactionInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutTransactionsInput = {
    update: XOR<UserUpdateWithoutTransactionsInput, UserUncheckedUpdateWithoutTransactionsInput>
    create: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTransactionsInput, UserUncheckedUpdateWithoutTransactionsInput>
  }

  export type UserUpdateWithoutTransactionsInput = {
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
    wallet?: WalletUpdateOneWithoutUserNestedInput
    deposits?: DepositUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTransactionsInput = {
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
    wallet?: WalletUncheckedUpdateOneWithoutUserNestedInput
    deposits?: DepositUncheckedUpdateManyWithoutUserNestedInput
  }

  export type WalletUpsertWithoutTransactionsInput = {
    update: XOR<WalletUpdateWithoutTransactionsInput, WalletUncheckedUpdateWithoutTransactionsInput>
    create: XOR<WalletCreateWithoutTransactionsInput, WalletUncheckedCreateWithoutTransactionsInput>
    where?: WalletWhereInput
  }

  export type WalletUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: WalletWhereInput
    data: XOR<WalletUpdateWithoutTransactionsInput, WalletUncheckedUpdateWithoutTransactionsInput>
  }

  export type WalletUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutWalletNestedInput
    balances?: WalletBalanceUpdateManyWithoutWalletNestedInput
    deposits?: DepositUpdateManyWithoutWalletNestedInput
    ledgerEntries?: LedgerEntryUpdateManyWithoutWalletNestedInput
  }

  export type WalletUncheckedUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    balances?: WalletBalanceUncheckedUpdateManyWithoutWalletNestedInput
    deposits?: DepositUncheckedUpdateManyWithoutWalletNestedInput
    ledgerEntries?: LedgerEntryUncheckedUpdateManyWithoutWalletNestedInput
  }

  export type CurrencyUpsertWithoutTransactionsInput = {
    update: XOR<CurrencyUpdateWithoutTransactionsInput, CurrencyUncheckedUpdateWithoutTransactionsInput>
    create: XOR<CurrencyCreateWithoutTransactionsInput, CurrencyUncheckedCreateWithoutTransactionsInput>
    where?: CurrencyWhereInput
  }

  export type CurrencyUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: CurrencyWhereInput
    data: XOR<CurrencyUpdateWithoutTransactionsInput, CurrencyUncheckedUpdateWithoutTransactionsInput>
  }

  export type CurrencyUpdateWithoutTransactionsInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    symbol?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: BoolFieldUpdateOperationsInput | boolean
    depositEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    balances?: WalletBalanceUpdateManyWithoutCurrencyNestedInput
    deposits?: DepositUpdateManyWithoutCurrencyNestedInput
    ledgerEntries?: LedgerEntryUpdateManyWithoutCurrencyNestedInput
  }

  export type CurrencyUncheckedUpdateWithoutTransactionsInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    symbol?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: BoolFieldUpdateOperationsInput | boolean
    depositEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    balances?: WalletBalanceUncheckedUpdateManyWithoutCurrencyNestedInput
    deposits?: DepositUncheckedUpdateManyWithoutCurrencyNestedInput
    ledgerEntries?: LedgerEntryUncheckedUpdateManyWithoutCurrencyNestedInput
  }

  export type DepositUpsertWithoutTransactionInput = {
    update: XOR<DepositUpdateWithoutTransactionInput, DepositUncheckedUpdateWithoutTransactionInput>
    create: XOR<DepositCreateWithoutTransactionInput, DepositUncheckedCreateWithoutTransactionInput>
    where?: DepositWhereInput
  }

  export type DepositUpdateToOneWithWhereWithoutTransactionInput = {
    where?: DepositWhereInput
    data: XOR<DepositUpdateWithoutTransactionInput, DepositUncheckedUpdateWithoutTransactionInput>
  }

  export type DepositUpdateWithoutTransactionInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    exchangeRate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDepositStatusFieldUpdateOperationsInput | $Enums.DepositStatus
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDepositsNestedInput
    wallet?: WalletUpdateOneRequiredWithoutDepositsNestedInput
    currency?: CurrencyUpdateOneRequiredWithoutDepositsNestedInput
  }

  export type DepositUncheckedUpdateWithoutTransactionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    exchangeRate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDepositStatusFieldUpdateOperationsInput | $Enums.DepositStatus
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LedgerEntryUpsertWithWhereUniqueWithoutTransactionInput = {
    where: LedgerEntryWhereUniqueInput
    update: XOR<LedgerEntryUpdateWithoutTransactionInput, LedgerEntryUncheckedUpdateWithoutTransactionInput>
    create: XOR<LedgerEntryCreateWithoutTransactionInput, LedgerEntryUncheckedCreateWithoutTransactionInput>
  }

  export type LedgerEntryUpdateWithWhereUniqueWithoutTransactionInput = {
    where: LedgerEntryWhereUniqueInput
    data: XOR<LedgerEntryUpdateWithoutTransactionInput, LedgerEntryUncheckedUpdateWithoutTransactionInput>
  }

  export type LedgerEntryUpdateManyWithWhereWithoutTransactionInput = {
    where: LedgerEntryScalarWhereInput
    data: XOR<LedgerEntryUpdateManyMutationInput, LedgerEntryUncheckedUpdateManyWithoutTransactionInput>
  }

  export type WalletCreateWithoutLedgerEntriesInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutWalletInput
    balances?: WalletBalanceCreateNestedManyWithoutWalletInput
    deposits?: DepositCreateNestedManyWithoutWalletInput
    transactions?: TransactionCreateNestedManyWithoutWalletInput
  }

  export type WalletUncheckedCreateWithoutLedgerEntriesInput = {
    id?: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    balances?: WalletBalanceUncheckedCreateNestedManyWithoutWalletInput
    deposits?: DepositUncheckedCreateNestedManyWithoutWalletInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutWalletInput
  }

  export type WalletCreateOrConnectWithoutLedgerEntriesInput = {
    where: WalletWhereUniqueInput
    create: XOR<WalletCreateWithoutLedgerEntriesInput, WalletUncheckedCreateWithoutLedgerEntriesInput>
  }

  export type CurrencyCreateWithoutLedgerEntriesInput = {
    code: string
    name: string
    symbol?: string | null
    country?: string | null
    region?: string | null
    flag?: string | null
    enabled?: boolean
    depositEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    balances?: WalletBalanceCreateNestedManyWithoutCurrencyInput
    deposits?: DepositCreateNestedManyWithoutCurrencyInput
    transactions?: TransactionCreateNestedManyWithoutCurrencyInput
  }

  export type CurrencyUncheckedCreateWithoutLedgerEntriesInput = {
    code: string
    name: string
    symbol?: string | null
    country?: string | null
    region?: string | null
    flag?: string | null
    enabled?: boolean
    depositEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    balances?: WalletBalanceUncheckedCreateNestedManyWithoutCurrencyInput
    deposits?: DepositUncheckedCreateNestedManyWithoutCurrencyInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutCurrencyInput
  }

  export type CurrencyCreateOrConnectWithoutLedgerEntriesInput = {
    where: CurrencyWhereUniqueInput
    create: XOR<CurrencyCreateWithoutLedgerEntriesInput, CurrencyUncheckedCreateWithoutLedgerEntriesInput>
  }

  export type TransactionCreateWithoutLedgerEntriesInput = {
    id?: string
    type?: $Enums.TransactionType
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.TransactionStatus
    provider?: $Enums.PaymentProvider | null
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    reference: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTransactionsInput
    wallet: WalletCreateNestedOneWithoutTransactionsInput
    currency: CurrencyCreateNestedOneWithoutTransactionsInput
    deposit?: DepositCreateNestedOneWithoutTransactionInput
  }

  export type TransactionUncheckedCreateWithoutLedgerEntriesInput = {
    id?: string
    userId: string
    walletId: string
    currencyCode: string
    type?: $Enums.TransactionType
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.TransactionStatus
    provider?: $Enums.PaymentProvider | null
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    reference: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    deposit?: DepositUncheckedCreateNestedOneWithoutTransactionInput
  }

  export type TransactionCreateOrConnectWithoutLedgerEntriesInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutLedgerEntriesInput, TransactionUncheckedCreateWithoutLedgerEntriesInput>
  }

  export type WalletUpsertWithoutLedgerEntriesInput = {
    update: XOR<WalletUpdateWithoutLedgerEntriesInput, WalletUncheckedUpdateWithoutLedgerEntriesInput>
    create: XOR<WalletCreateWithoutLedgerEntriesInput, WalletUncheckedCreateWithoutLedgerEntriesInput>
    where?: WalletWhereInput
  }

  export type WalletUpdateToOneWithWhereWithoutLedgerEntriesInput = {
    where?: WalletWhereInput
    data: XOR<WalletUpdateWithoutLedgerEntriesInput, WalletUncheckedUpdateWithoutLedgerEntriesInput>
  }

  export type WalletUpdateWithoutLedgerEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutWalletNestedInput
    balances?: WalletBalanceUpdateManyWithoutWalletNestedInput
    deposits?: DepositUpdateManyWithoutWalletNestedInput
    transactions?: TransactionUpdateManyWithoutWalletNestedInput
  }

  export type WalletUncheckedUpdateWithoutLedgerEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    balances?: WalletBalanceUncheckedUpdateManyWithoutWalletNestedInput
    deposits?: DepositUncheckedUpdateManyWithoutWalletNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutWalletNestedInput
  }

  export type CurrencyUpsertWithoutLedgerEntriesInput = {
    update: XOR<CurrencyUpdateWithoutLedgerEntriesInput, CurrencyUncheckedUpdateWithoutLedgerEntriesInput>
    create: XOR<CurrencyCreateWithoutLedgerEntriesInput, CurrencyUncheckedCreateWithoutLedgerEntriesInput>
    where?: CurrencyWhereInput
  }

  export type CurrencyUpdateToOneWithWhereWithoutLedgerEntriesInput = {
    where?: CurrencyWhereInput
    data: XOR<CurrencyUpdateWithoutLedgerEntriesInput, CurrencyUncheckedUpdateWithoutLedgerEntriesInput>
  }

  export type CurrencyUpdateWithoutLedgerEntriesInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    symbol?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: BoolFieldUpdateOperationsInput | boolean
    depositEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    balances?: WalletBalanceUpdateManyWithoutCurrencyNestedInput
    deposits?: DepositUpdateManyWithoutCurrencyNestedInput
    transactions?: TransactionUpdateManyWithoutCurrencyNestedInput
  }

  export type CurrencyUncheckedUpdateWithoutLedgerEntriesInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    symbol?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: BoolFieldUpdateOperationsInput | boolean
    depositEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    balances?: WalletBalanceUncheckedUpdateManyWithoutCurrencyNestedInput
    deposits?: DepositUncheckedUpdateManyWithoutCurrencyNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutCurrencyNestedInput
  }

  export type TransactionUpsertWithoutLedgerEntriesInput = {
    update: XOR<TransactionUpdateWithoutLedgerEntriesInput, TransactionUncheckedUpdateWithoutLedgerEntriesInput>
    create: XOR<TransactionCreateWithoutLedgerEntriesInput, TransactionUncheckedCreateWithoutLedgerEntriesInput>
    where?: TransactionWhereInput
  }

  export type TransactionUpdateToOneWithWhereWithoutLedgerEntriesInput = {
    where?: TransactionWhereInput
    data: XOR<TransactionUpdateWithoutLedgerEntriesInput, TransactionUncheckedUpdateWithoutLedgerEntriesInput>
  }

  export type TransactionUpdateWithoutLedgerEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    provider?: NullableEnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider | null
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTransactionsNestedInput
    wallet?: WalletUpdateOneRequiredWithoutTransactionsNestedInput
    currency?: CurrencyUpdateOneRequiredWithoutTransactionsNestedInput
    deposit?: DepositUpdateOneWithoutTransactionNestedInput
  }

  export type TransactionUncheckedUpdateWithoutLedgerEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    provider?: NullableEnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider | null
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deposit?: DepositUncheckedUpdateOneWithoutTransactionNestedInput
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

  export type DepositCreateManyUserInput = {
    id?: string
    walletId: string
    currencyCode: string
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    exchangeRate?: Decimal | DecimalJsLike | number | string | null
    provider?: $Enums.PaymentProvider
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    country?: string | null
    countryCode?: string | null
    status?: $Enums.DepositStatus
    idempotencyKey?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    transactionId?: string | null
  }

  export type TransactionCreateManyUserInput = {
    id?: string
    walletId: string
    currencyCode: string
    type?: $Enums.TransactionType
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.TransactionStatus
    provider?: $Enums.PaymentProvider | null
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    reference: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
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

  export type DepositUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    exchangeRate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDepositStatusFieldUpdateOperationsInput | $Enums.DepositStatus
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wallet?: WalletUpdateOneRequiredWithoutDepositsNestedInput
    currency?: CurrencyUpdateOneRequiredWithoutDepositsNestedInput
    transaction?: TransactionUpdateOneWithoutDepositNestedInput
  }

  export type DepositUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    exchangeRate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDepositStatusFieldUpdateOperationsInput | $Enums.DepositStatus
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DepositUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    exchangeRate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDepositStatusFieldUpdateOperationsInput | $Enums.DepositStatus
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TransactionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    provider?: NullableEnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider | null
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wallet?: WalletUpdateOneRequiredWithoutTransactionsNestedInput
    currency?: CurrencyUpdateOneRequiredWithoutTransactionsNestedInput
    deposit?: DepositUpdateOneWithoutTransactionNestedInput
    ledgerEntries?: LedgerEntryUpdateManyWithoutTransactionNestedInput
  }

  export type TransactionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    provider?: NullableEnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider | null
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deposit?: DepositUncheckedUpdateOneWithoutTransactionNestedInput
    ledgerEntries?: LedgerEntryUncheckedUpdateManyWithoutTransactionNestedInput
  }

  export type TransactionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    provider?: NullableEnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider | null
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletBalanceCreateManyWalletInput = {
    id?: string
    currencyCode: string
    availableBalance?: Decimal | DecimalJsLike | number | string
    pendingBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DepositCreateManyWalletInput = {
    id?: string
    userId: string
    currencyCode: string
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    exchangeRate?: Decimal | DecimalJsLike | number | string | null
    provider?: $Enums.PaymentProvider
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    country?: string | null
    countryCode?: string | null
    status?: $Enums.DepositStatus
    idempotencyKey?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    transactionId?: string | null
  }

  export type TransactionCreateManyWalletInput = {
    id?: string
    userId: string
    currencyCode: string
    type?: $Enums.TransactionType
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.TransactionStatus
    provider?: $Enums.PaymentProvider | null
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    reference: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LedgerEntryCreateManyWalletInput = {
    id?: string
    currencyCode: string
    transactionId?: string | null
    type: $Enums.LedgerEntryType
    amount: Decimal | DecimalJsLike | number | string
    balanceBefore: Decimal | DecimalJsLike | number | string
    balanceAfter: Decimal | DecimalJsLike | number | string
    reference?: string | null
    reason?: string | null
    createdAt?: Date | string
  }

  export type WalletBalanceUpdateWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    availableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pendingBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    currency?: CurrencyUpdateOneRequiredWithoutBalancesNestedInput
  }

  export type WalletBalanceUncheckedUpdateWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    availableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pendingBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletBalanceUncheckedUpdateManyWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    availableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pendingBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepositUpdateWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    exchangeRate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDepositStatusFieldUpdateOperationsInput | $Enums.DepositStatus
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDepositsNestedInput
    currency?: CurrencyUpdateOneRequiredWithoutDepositsNestedInput
    transaction?: TransactionUpdateOneWithoutDepositNestedInput
  }

  export type DepositUncheckedUpdateWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    exchangeRate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDepositStatusFieldUpdateOperationsInput | $Enums.DepositStatus
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DepositUncheckedUpdateManyWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    exchangeRate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDepositStatusFieldUpdateOperationsInput | $Enums.DepositStatus
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TransactionUpdateWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    provider?: NullableEnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider | null
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTransactionsNestedInput
    currency?: CurrencyUpdateOneRequiredWithoutTransactionsNestedInput
    deposit?: DepositUpdateOneWithoutTransactionNestedInput
    ledgerEntries?: LedgerEntryUpdateManyWithoutTransactionNestedInput
  }

  export type TransactionUncheckedUpdateWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    provider?: NullableEnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider | null
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deposit?: DepositUncheckedUpdateOneWithoutTransactionNestedInput
    ledgerEntries?: LedgerEntryUncheckedUpdateManyWithoutTransactionNestedInput
  }

  export type TransactionUncheckedUpdateManyWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    provider?: NullableEnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider | null
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LedgerEntryUpdateWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumLedgerEntryTypeFieldUpdateOperationsInput | $Enums.LedgerEntryType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceBefore?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceAfter?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    currency?: CurrencyUpdateOneRequiredWithoutLedgerEntriesNestedInput
    transaction?: TransactionUpdateOneWithoutLedgerEntriesNestedInput
  }

  export type LedgerEntryUncheckedUpdateWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumLedgerEntryTypeFieldUpdateOperationsInput | $Enums.LedgerEntryType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceBefore?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceAfter?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LedgerEntryUncheckedUpdateManyWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumLedgerEntryTypeFieldUpdateOperationsInput | $Enums.LedgerEntryType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceBefore?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceAfter?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletBalanceCreateManyCurrencyInput = {
    id?: string
    walletId: string
    availableBalance?: Decimal | DecimalJsLike | number | string
    pendingBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DepositCreateManyCurrencyInput = {
    id?: string
    userId: string
    walletId: string
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    exchangeRate?: Decimal | DecimalJsLike | number | string | null
    provider?: $Enums.PaymentProvider
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    country?: string | null
    countryCode?: string | null
    status?: $Enums.DepositStatus
    idempotencyKey?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    transactionId?: string | null
  }

  export type TransactionCreateManyCurrencyInput = {
    id?: string
    userId: string
    walletId: string
    type?: $Enums.TransactionType
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.TransactionStatus
    provider?: $Enums.PaymentProvider | null
    providerTransactionId?: string | null
    providerReference?: string | null
    paymentMethod?: $Enums.PaymentMethod | null
    reference: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LedgerEntryCreateManyCurrencyInput = {
    id?: string
    walletId: string
    transactionId?: string | null
    type: $Enums.LedgerEntryType
    amount: Decimal | DecimalJsLike | number | string
    balanceBefore: Decimal | DecimalJsLike | number | string
    balanceAfter: Decimal | DecimalJsLike | number | string
    reference?: string | null
    reason?: string | null
    createdAt?: Date | string
  }

  export type WalletBalanceUpdateWithoutCurrencyInput = {
    id?: StringFieldUpdateOperationsInput | string
    availableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pendingBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wallet?: WalletUpdateOneRequiredWithoutBalancesNestedInput
  }

  export type WalletBalanceUncheckedUpdateWithoutCurrencyInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    availableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pendingBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletBalanceUncheckedUpdateManyWithoutCurrencyInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    availableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pendingBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepositUpdateWithoutCurrencyInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    exchangeRate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDepositStatusFieldUpdateOperationsInput | $Enums.DepositStatus
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDepositsNestedInput
    wallet?: WalletUpdateOneRequiredWithoutDepositsNestedInput
    transaction?: TransactionUpdateOneWithoutDepositNestedInput
  }

  export type DepositUncheckedUpdateWithoutCurrencyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    exchangeRate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDepositStatusFieldUpdateOperationsInput | $Enums.DepositStatus
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DepositUncheckedUpdateManyWithoutCurrencyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    exchangeRate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDepositStatusFieldUpdateOperationsInput | $Enums.DepositStatus
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TransactionUpdateWithoutCurrencyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    provider?: NullableEnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider | null
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTransactionsNestedInput
    wallet?: WalletUpdateOneRequiredWithoutTransactionsNestedInput
    deposit?: DepositUpdateOneWithoutTransactionNestedInput
    ledgerEntries?: LedgerEntryUpdateManyWithoutTransactionNestedInput
  }

  export type TransactionUncheckedUpdateWithoutCurrencyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    provider?: NullableEnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider | null
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deposit?: DepositUncheckedUpdateOneWithoutTransactionNestedInput
    ledgerEntries?: LedgerEntryUncheckedUpdateManyWithoutTransactionNestedInput
  }

  export type TransactionUncheckedUpdateManyWithoutCurrencyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    provider?: NullableEnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider | null
    providerTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LedgerEntryUpdateWithoutCurrencyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumLedgerEntryTypeFieldUpdateOperationsInput | $Enums.LedgerEntryType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceBefore?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceAfter?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wallet?: WalletUpdateOneRequiredWithoutLedgerEntriesNestedInput
    transaction?: TransactionUpdateOneWithoutLedgerEntriesNestedInput
  }

  export type LedgerEntryUncheckedUpdateWithoutCurrencyInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumLedgerEntryTypeFieldUpdateOperationsInput | $Enums.LedgerEntryType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceBefore?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceAfter?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LedgerEntryUncheckedUpdateManyWithoutCurrencyInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumLedgerEntryTypeFieldUpdateOperationsInput | $Enums.LedgerEntryType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceBefore?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceAfter?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LedgerEntryCreateManyTransactionInput = {
    id?: string
    walletId: string
    currencyCode: string
    type: $Enums.LedgerEntryType
    amount: Decimal | DecimalJsLike | number | string
    balanceBefore: Decimal | DecimalJsLike | number | string
    balanceAfter: Decimal | DecimalJsLike | number | string
    reference?: string | null
    reason?: string | null
    createdAt?: Date | string
  }

  export type LedgerEntryUpdateWithoutTransactionInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumLedgerEntryTypeFieldUpdateOperationsInput | $Enums.LedgerEntryType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceBefore?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceAfter?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wallet?: WalletUpdateOneRequiredWithoutLedgerEntriesNestedInput
    currency?: CurrencyUpdateOneRequiredWithoutLedgerEntriesNestedInput
  }

  export type LedgerEntryUncheckedUpdateWithoutTransactionInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    type?: EnumLedgerEntryTypeFieldUpdateOperationsInput | $Enums.LedgerEntryType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceBefore?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceAfter?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LedgerEntryUncheckedUpdateManyWithoutTransactionInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    currencyCode?: StringFieldUpdateOperationsInput | string
    type?: EnumLedgerEntryTypeFieldUpdateOperationsInput | $Enums.LedgerEntryType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceBefore?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceAfter?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
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