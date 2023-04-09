  /** 
  * Foo class
  */
  case class Foo (arg: Int) {
      def bar(): Unit =
          println("Hello, world!")
          
      implicit lazy val x: Int = 1 + 2
      type Baz = Int
  }
