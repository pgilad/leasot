namespace Library1

// TODO: This is a single line comment
module Module1 =

    let function1 x = x + 1
    // FIXME: This is a single line fixme

    type Type1() =
        member type1.method1() =
            printfn "type1.method1"
        member type1.method2() =
            printfn "type1.method2"

    (*
        TODO: This is a multiline todo
    *)

    [<Sealed>]
    type Type2() =
        member type2.method1() =
            printfn "type2.method1"
        member type2.method2() =
            printfn "type2.method2"

    [<Interface>]
    type InterfaceType1 =
        abstract member method1 : int -> int
        abstract member method2 : string -> unit
