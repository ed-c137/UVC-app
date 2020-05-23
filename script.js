
        var a = document.getElementsByClassName('nav-menu-btn')[0];
        a.addEventListener('click',function(e){
            var b = document.getElementsByTagName('body')[0];
            b.classList.toggle('openNav');
            e.stopPropagation();
        });
        //var body = document.getElementsByTagName('html')[0];
        document.addEventListener('click',(e)=>{
           if( document.getElementsByTagName('body')[0].classList.contains('openNav') ){ document.getElementsByTagName('body')[0].classList.remove('openNav')};
          
        });

       
        //power button
        var powerswch = document.getElementsByClassName('power-button')[0];
        powerswch.addEventListener('click', function(){
            let offstate = document.getElementsByClassName('off-state')[0];
           // console.log(offstate.style.visibility);
           let xhttp = new XMLHttpRequest();
            if(window.getComputedStyle( offstate ).visibility === 'visible'){
                offstate.style.visibility = 'hidden';
                xhttp.open("GET", "10.10.10.1/control?state=0", true);
            }else{
                offstate.style.visibility = 'visible';
                xhttp.open("GET", "10.10.10.1/control?state=1", true);
            }
            // xhttp.onreadystatechange = function() {
            //   if (this.readyState == 4 && this.status == 200) {
            //     //check state here
            //     let res = JSON.parse(this.responseText);
            //     let elm = document.getElementsByClassName('off-state')[0].style.visibility;
            //     (res.state) ?  elm = 'visible': elm = 'hidden';
            //   }
            // };
            xhttp.send();
        });

        window.onload = function () {
          //console.log('loaded');
          let xhttp = new XMLHttpRequest();
          xhttp.open("GET", "10.10.10.1/check", true);
          xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
              //check state here
              let res = JSON.parse(this.responseText);
              let elm = document.getElementsByClassName('off-state')[0].style.visibility;
              (res.state) ?  elm = 'visible': elm = 'hidden';
            }
          };
          xhttp.send();
        }

var notsetelm = '<tr class="notset"><td colspan="3" style="text-align:center">Not Set </td> '

var modal = document.querySelector(".modal");
var btn = document.querySelector(".add-label");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close-addmodal")[0];

// When the user clicks the button, open the modal 
btn.addEventListener('click', function(){
  modal.style.display = "block";
});

// When the user clicks on <span> (x), close the modal
span.addEventListener('click', function(){
  modal.style.display = "none";
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

var dow = document.querySelector('.dayofweek');
var chcon = document.querySelector('.checkbox-con');
dow.addEventListener('click', function(e){
    console.log(e.target.classList[0]);
    var clicked = e.target.classList[0];
    var chkbx = chcon.getElementsByClassName(clicked)[0].checked;
    console.log(chcon.getElementsByClassName(clicked)[0].checked);
    if(chkbx){
        console.log('set to false');
        chcon.getElementsByClassName(clicked)[0].checked = false;
        e.target.classList.remove("selected");
        //verifychkbx(e.target);
    }else{
        console.log('set to true');
        chcon.getElementsByClassName(clicked)[0].checked = true;
        e.target.classList.add("selected");
        //verifychkbx(e.target);
    }
});

//  function verifychkbx(chkbx){
//     var days = document.querySelectorAll('.dayofweek li');


// }
// console.log()
let flag = 0;

document.getElementById('add-btn').addEventListener('click', function(e){
      e.preventDefault();
      let week = false;
      let time = false;
      let period = false;
      let weekval = [];
      let timeval;
      let periodval;
      let binweeks = [];
      //let weeks = ['M','Tu','W','Th', 'F','Sa','Su']
      var form = e.currentTarget.parentElement.parentElement;
      form.querySelectorAll('.checkbox-con input').forEach( elm => {   
        if(elm.checked){ 
          week = true; 
          binweeks.push(1); //elm.classList[0]
          weekval.push(elm.classList[0]);
        }else{
          binweeks.push(0);
        }
      });
      time = Boolean(form.querySelector('#appt').value);
      period = document.querySelector('#period').value != 0;
      // console.log('week', week);
      // console.log('time', time);
      // console.log('period', period);
      //console.log(Boolean(form.querySelector('#appt').value));
      
      if(week && time && period){
          timeval = form.querySelector('#appt').value;
          periodval = document.querySelector('#period').value;
          let fschedule = {
            "week": weekval,
            "time": timeval,
            "period" : periodval,
          }
          console.log(fschedule);

          var scheclm = `<tr><td> ${weekval.toString()} </td><td> ${timeval} for ${periodval} min</td><td class="action-btns">
                    <a href="#" class="delete-schedule"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M18 19a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4V4h4.5l1-1h4l1 1H19v3h-1v12zM6 7v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V7H6zm12-1V5h-4l-1-1h-3L9 5H5v1h13zM8 9h1v10H8V9zm6 0h1v10h-1V9z" fill="currentColor"/></svg></a></td></tr>`;
            let nsch = document.querySelectorAll('#modalschedule tbody tr').length;

            if(nsch < 3){
              console.log(nsch);
              if(flag == 0){
                document.querySelector('#modalschedule tbody').innerHTML = scheclm;
                flag = 1;
              }else{
                document.querySelector('#modalschedule tbody').innerHTML += scheclm;
              }
            }
         }
      
})
var chktble = document.querySelectorAll('#schedule tbody tr.schedule')[0];
//console.log('the table is :', chktble);
if(!chktble) {
  document.querySelectorAll('#schedule tbody')[0].innerHTML = notsetelm;
  document.querySelector('#main-schedule table').style.width = "80%";
  document.querySelectorAll('#modalschedule tbody')[0].innerHTML = notsetelm;
  document.querySelector('.modal-rowschdule table').style.width = "100%";
} 


var chconall = document.querySelectorAll('.checkbox-con input');
chconall.forEach(element => console.log(element.classList[0], element.checked));

var settime = document.querySelector('#appt');

var period = document.querySelector('#period');

//for save
document.querySelector('.save-addmodal').addEventListener('click', function(e){
    let elm = document.querySelector('#schedule tbody');
    //let nselm = document.querySelector('#schedule tbody .notset');
   // console.log(nselm.classList[0] == 'notset');
    var nclone =  document.querySelector('#modalschedule tbody').cloneNode(true);
    console.log(nclone);
    if( document.querySelector('#modalschedule tbody').firstElementChild ){
      elm.remove();
      document.querySelector('#schedule').append(nclone);
      modal.style.display = "none";
    }
  });
//for delete on modal
document.querySelector('#modalschedule').addEventListener('click', function(e){
  console.log(e.target);
  if(e.target.parentElement.classList[0] == 'delete-schedule'){
    e.target.parentElement.parentElement.parentElement.remove();
  }
  if( !document.querySelector('#modalschedule tbody').firstElementChild ){
    document.querySelectorAll('#modalschedule tbody')[0].innerHTML = notsetelm; 
  }
});

//for delete on mainpage
document.querySelector('#schedule').addEventListener('click', function(e){
  if(e.target.classList[0] == 'delete-schedule'){
    e.target.parentElement.parentElement.remove();
  }
  //add code here to update the backend
});