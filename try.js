

function Person() {
  console.log('Person instantiated');
}
Person.prototype.sayHello = function () {
	console.log("hello");
}


var person1 = new Person();
var person2 = new Person();

person1.sayHello();
person2.sayHello();
