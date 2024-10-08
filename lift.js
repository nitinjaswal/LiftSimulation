let lifts = [];
let queue = [];
let liftInProcess = [];

let liftC = localStorage.getItem("liftCount");

window.onload = function () {
  generateFloorAndLifts();
};

function generateFloorAndLifts() {
  createBuilding();
}

function createBuilding() {
  //Getting variables from localStorage
  let floorCount = localStorage.getItem("floorCount");
  let liftCount = localStorage.getItem("liftCount");

  createFloors(floorCount);
  createLifts(liftCount);

  //Need to fix width of lift floor ad per lift numbers
  floorWidth(liftCount);
  setInterval(checkLifts, 200);
}

function floorWidth(liftCount) {
  let liftWidth = 50;
  let totalWidth = liftWidth * liftCount * 1.5;

  document.querySelectorAll(".floor-container").forEach((floor) => {
    floor.style.minWidth = `${totalWidth}px`;
  });
}

//Creating html for floor and appending it
function createFloors(floorCount) {
  const container = document.querySelector(".center-building");
  for (let i = 1; i <= floorCount; i++) {
    let building = `
        <div class="floor-container" id='floor${i}'>      
   
       <span id="sp${i}">
            ${
              i == floorCount || liftC == 0
                ? ""
                : `
                  <button class="up" id="up${i}" onclick="storeFloorClickEvent(event)">
                    Up
                  </button><br>
               `
            }
            ${
              i == 1 || liftC == 0
                ? ""
                : `
                  <button class="down" id="down${i}" onclick="storeFloorClickEvent(event)">
                    Down
                  </button>
                `
            }
              <br>
                  <span> Floor ${i}</span>
              </span>
              
        </div>
        
     
      `;

    container.insertAdjacentHTML("afterbegin", building);
  }
}

function createLifts(liftCount) {
  const lift = document.getElementById("sp1");

  //Creating html for lift and appending it
  for (let i = 1; i <= liftCount; i++) {
    let liftHtml = `
    <div class="lift-container" id='lift${i}'>
   <div id='ld${i}' class="lift-door lift-door-left"></div><div  id='rd${i}' class="lift-door lift-door-right" ></div>
    </div>`;
    lift.insertAdjacentHTML("afterend", liftHtml);
  }

  //After building is created ,maintaining an initial array with lift data
  lifts = Array.from(
    document.querySelectorAll(".lift-container"),
    (element) => ({
      element: element,
      isLiftBusy: false,
      currentFloor: 1,
    })
  );

  //Handle current lift(which is in moving state)
  liftInProcess = Array.from(lifts.length).fill(null);
}

//Storing floor ids in queue
function storeFloorClickEvent(event) {
  let clickedFloor = event.target.id;
  let floorNumber;

  //floorNumber = parseInt(clickedButton.match(/\d+$/));
  floorNumber = clickedFloor;

  if (!queue.includes(floorNumber) && !liftInProcess.includes(floorNumber)) {
    queue.push(floorNumber);
  }
}

function currentLiftOnFloor(clickedFloor) {
  floorId = clickedFloor.match(/\d+$/);
  let currentLiftOnFloor;
  for (lift of lifts) {
    if (lift.currentFloor == floorId) {
      currentLiftOnFloor = lift;
    }
  }
  return currentLiftOnFloor?.element.id.match(/\d+$/);
}

//Checking availability of lifts from (lifts array (isLiftBusy flag)) and select nearest lift
function getAvailableLift(floorId) {
  let selectedLift;
  let distance = 9999999;

  for (lift of lifts) {
    if (!lift.isLiftBusy && Math.abs(floorId - lift.currentFloor) < distance) {
      distance = Math.abs(floorId - lift.currentFloor);
      selectedLift = lift;
    }
  }
  return selectedLift;
}

function startLift(lift, toFloor) {
  let floorElement = queue.shift();
  let yAxis = (toFloor - 1) * 91 * -1; //91 is lift height
  let from = lift.currentFloor;
  let transValue = Math.abs(toFloor - from) * 2.5; //Fix after review

  let lid = lift.element.id.match(/\d+$/);
  liftInProcess[lid] = floorElement;

  //Actual lift html element
  let liftId = lift.element.id;
  lift.currentFloor = toFloor;
  lift.isLiftBusy = true;
  let selectedLiftElement = lift.element;
  selectedLiftElement.style.transform = `translateY(${yAxis}px)`;
  selectedLiftElement.style.transition = `${transValue}s linear`;

  //open door when lift reaches the floor with some delay

  handleDoorAnimation(lid, transValue * 1000);

  //Reset lift state when door open close is complete upon reaching the fllor
  setTimeout(() => {
    resetLiftState(liftId, floorElement);
  }, transValue * 1000 + 5000);
}

function resetLiftState(liftId, floorElement) {
  let toFloor = parseInt(floorElement.match(/\d+$/));
  for (lift of lifts) {
    if (lift.element.id == liftId) {
      lift.isLiftBusy = false;
      lift.currentFloor = toFloor;
    }
  }
  let index = liftInProcess.indexOf(floorElement);
  liftInProcess[index] = null;
}

function checkLifts() {
  if (queue.length == 0) return;
  let floorId = parseInt(queue[0].match(/\d+$/)); //get first item in queue

  let lift = getAvailableLift(floorId);

  if (lift) {
    startLift(lift, floorId);
  }
}

function handleDoorAnimation(liftId, transitionDuration) {
  setTimeout(() => {
    openDoor(liftId);
  }, transitionDuration);
  setTimeout(() => {
    closeDoor(liftId);
  }, transitionDuration + 2500);
}

function openDoor(liftId) {
  let ld = document.getElementById("ld" + liftId);
  let rd = document.getElementById("rd" + liftId);
  ld.style.transform = `translateX(-100%)`;
  rd.style.transform = `translateX(100%)`;
  ld.style.transition = `all 2.5s ease-out`;
  rd.style.transition = `all 2.5s ease-out`;
}

function closeDoor(liftId) {
  let ld = document.getElementById("ld" + liftId);
  let rd = document.getElementById("rd" + liftId);
  ld.style.transform = `translateX(0)`;
  rd.style.transform = `translateX(0)`;
  ld.style.transition = `all 2.5s ease-out`;
  rd.style.transition = `all 2.5s ease-out`;
}
