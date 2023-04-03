import {Animal} from "./animal.js";

export class Dog extends Animal {

    constructor(props) {
        super(props);
    }

    speak() {
        console.log("www～")
    }

}