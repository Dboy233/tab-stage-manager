import {Animal} from "./animal.js";

export class Cat extends Animal {

    constructor(props) {
        super(props);
    }

    speak() {
        console.log("mmm～")
    }

}