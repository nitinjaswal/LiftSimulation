function validate() {
  let floorCount = document.getElementById("floors").value;
  let liftCount = document.getElementById("lifts").value;

  setLocalStorageForFloorAndLift(floorCount, liftCount);
}

function setLocalStorageForFloorAndLift(floorCount, liftCount) {
  localStorage.setItem("floorCount", floorCount);
  localStorage.setItem("liftCount", liftCount);
}
