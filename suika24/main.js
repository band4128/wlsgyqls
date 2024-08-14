// fruits.js 불러오기
import  { FRUITS } from "./fruits.js";

// 모듈 불러오기
let Engine = Matter.Engine,
    Runner = Matter.Runner,
    Render = Matter.Render,
    Bodies = Matter.Bodies,
    World = Matter.World,
    Body = Matter.Body,
    Events = Matter.Events;

// 엔진 선언
const engine = Engine.create();

// 렌더 선언(배경)
const render = Render.create({
    engine,
    element: document.body,
    options: {
        wireframes: false, // true: 배경색 적용 안됌
        background: "skyblue",
        width: 565,
        height: 850
    }
});

// 벽 배치를 위한 world 선언
const world = engine.world;

// 왼쪽 벽 생성
const leftWall = Bodies.rectangle(15, 395, 30, 790, {
    isStatic: true, // 벽 고정 기능
    render: { fillStyle: 'black' }
})

// 오른쪽 벽 생성
const rightWall = Bodies.rectangle(550, 395, 30, 790, {
    isStatic: true, // 벽 고정 기능
    render: { fillStyle: 'black' }
})

// 바닥 생성
const ground = Bodies.rectangle(280, 820, 620, 60, {
    isStatic: true, // 벽 고정 기능
    render: { fillStyle: 'black' }
})

// 종료 라인 생성
const topLine = Bodies.rectangle(310, 150, 620, 2, {
    isStatic: true, // 벽 고정 기능
    isSensor: true, // 물리는 적용하지 않지만 충돌은 감지
    render: { fillStyle: 'black' }
})

World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
// 조작을 제어하는 변수
let disableAction = false;

// 과일 떨어지는 함수 선언
function addFruits() {

    // 불러올 과일 번호
    const index = Math.floor(Math.random() * 5);
    console.log(index);
    const fruit = FRUITS[index];
    const body = Bodies.circle(300, 15, fruit.radius, {
        index : index,
        isSleeping: true,
        render: {
            sprite: {texture: `${fruit.name}.png`},
        },
        restitution: .5, 
    })
    currentBody = body;
    currentFruit = fruit;
    World.add(world, body);
}

window.onkeydown = (event) => {

    if(disableAction)
    return;
    switch(event.code) {
        case "KeyA" :
            if(currentBody.position.x - currentFruit.radius > 30)
            // 왼쪽으로 이동
            Body.setPosition(currentBody, {
                x : currentBody.position.x - 10,
                y : currentBody.position.y,
            });
            break;
        case "KeyD" :
            if(currentBody.position.x + currentFruit.radius < 535)
            Body.setPosition(currentBody, {
                x : currentBody.position.x + 10,
                y : currentBody.position.y,
            });
            break;
        case "KeyS" :
            currentBody.isSleeping = false;
            disableAction = true;
            
            setTimeout(() => {
                addFruits();
                disableAction = false;
            }, 1000);
            break;
    }
}

Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach((collision) => {
        if(collision.bodyA.index == collision.bodyB.index){
            const index = collision.bodyA.index;
            if(index === FRUITS.length - 1) { 
                return;
            }
            World.remove(world, [collision.bodyA, collision.bodyB])

            const newFruit = FRUITS[index + 1]
            const newBody = Bodies.circle(
                collision.collision.supports[0].x,
                collision.collision.supports[0].y,
                newFruit.radius,
                {
                    index : index + 1,
                    render : {sprite : {texture : `${newFruit.name}.png`}}
                }
            )
            World.add(world, newBody);

        }
    })
})

addFruits();