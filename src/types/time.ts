type Enumerate<
  N extends number,
  Acc extends number[] = [],
> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

type Range<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>;

type PadZero<N extends number> = N extends 0
  ? '00'
  : N extends 1
    ? '01'
    : N extends 2
      ? '02'
      : N extends 3
        ? '03'
        : N extends 4
          ? '04'
          : N extends 5
            ? '05'
            : N extends 6
              ? '06'
              : N extends 7
                ? '07'
                : N extends 8
                  ? '08'
                  : N extends 9
                    ? '09'
                    : `${N}`;

export type Hour = PadZero<Range<0, 24>>;
export type Minute = PadZero<Range<0, 60>>;

export type TimeString = `${Hour}:${Minute}`;
