document.addEventListener("DOMContentLoaded", function() {
function $(id){ return document.getElementById(id);}
const locations = [
    "Bravosian Coastlands",
    "Hills of Norvos",
    "The Flatlands",
    "The Axe",
    "The Golden Fields",
    "Upper Rhoyne",
    "Forest of Qohor",
    "Myr",
    "Tyrosh",
    "The Orange Shore",
    "Lys",
    "Lower Rhoyne",
    "Volantis",
    "Mantaris",
    "The Sea of Sights",
    "Oros",
    "Valyria",
    "Western Dothraki Sea",
    "Sarnor",
    "Northern Dothraki Sea",
    "Eastern Dothraki Sea",
    "Vaes Dothrak",
    "The Footprint",
    "Northern Jade Sea",
    "Samyrian",
    "Bayasabhad",
    "Qarth",
    "The Red Waste",
    "Meereen",
    "Yunkai",
    "Astapor",
    "Old Ghis",
    "New Ghis",
    "Lhazar"
];
const socket = io();
const floatingMenu = $("floatingMenu");

//       Starts Turn
function startTurn(){
locations.forEach( element => {
    
    $(element).addEventListener("click",async function(event) {
      event.preventDefault();
      const move = {
        name: $("userid").innerText,//username
        tile: element,
        gameid: $("gameid").innerText
    };
    await socket.emit("get_menu_data",move);
    await socket.on("availableMoves",async(moves)=>{
            const menu = $("menuDropdown");
            menu.innerHTML = "";
            moves.forEach(optionValue => {
                const option = document.createElement('option');
                option.value = optionValue;
                option.textContent = optionValue;
                menu.appendChild(option);
                menu.name(element);
            });
        
        })

    
      showFloatingMenu(event.pageX, event.pageY);
    });
  });}

  //     ENDS turn 

  function endturn(){
    locations.forEach(element => {
        $(element).removeEventListener();
    })
  }
  

  function showFloatingMenu(x, y) {
    floatingMenu.style.left = x + "px";
    floatingMenu.style.top = y + "px";
    floatingMenu.style.display = "block";

    // Add mousedown event listener to start dragging
    floatingMenu.addEventListener("mousedown", startDrag);
  }

  function startDrag(event) {
    isDragging = true;
    offsetX = event.clientX - parseFloat(this.style.left);
    offsetY = event.clientY - parseFloat(this.style.top);

    // Add mousemove and mouseup event listeners for dragging
    window.addEventListener("mousemove", doDrag);
    window.addEventListener("mouseup", endDrag);
  }

  function doDrag(event) {
    if (!isDragging) return;

    floatingMenu.style.left = event.clientX - offsetX + "px";
    floatingMenu.style.top = event.clientY - offsetY + "px";
  }

  function endDrag() {
    isDragging = false;
    offsetX = offsetY = null;

    // Remove mousemove and mouseup event listeners
    window.removeEventListener("mousemove", doDrag);
    window.removeEventListener("mouseup", endDrag);
  }
  socket.on("your_turn",()=>{startTurn();});

  socket.on("end_turn",()=>{endturn();})

  $("submitButton").addEventListener("click",  async function() {
    const from = $("menuDropdown").name;
    const target = $("menuDropdown").value;
    
    const dataToSend = {
        target: selectedOption,
        from: a,
        gameid: $("gameid").innerText
        
    };
    
    await socket.emit('Move_played',  dataToSend);
    $("menuDropdown").name = "";
    floatingMenu.style.display = "none";});
});