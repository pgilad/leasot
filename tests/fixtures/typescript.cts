// TODO: change to public
class Greeter {
    constructor(public greeting: string) { }
    greet() {
        return "<h1>" + this.greeting + "</h1>";
    }
};
var greeter = new Greeter("Hello, world!");
var str = greeter.greet();
/*
 * FIXME: use jquery
 */
document.body.innerHTML = str;
