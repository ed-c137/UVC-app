// var powerswch = document.getElementsByClassName('power-button')[0];
// powerswch.addEventListener('click', function(){
//     let offstate = document.getElementsByClassName('off-state')[0];
//    // console.log(offstate.style.visibility);
//    let xhttp = new XMLHttpRequest();
//     if(window.getComputedStyle( offstate ).visibility === 'visible'){
//         offstate.style.visibility = 'hidden';
//         xhttp.open("GET", "10.10.10.1/control?state=0", true);
//     }else{
//         offstate.style.visibility = 'visible';
//         xhttp.open("GET", "10.10.10.1/control?state=1", true);
//     }
//     xhttp.send();
// });
       

var base = '10.10.10.1';
let ala = {};//object for all alarms
let fschedule; //temp store for an alarm
let fschedulearr = {};//temp
let ids = [];
//intialize function
let lstate;
$(function(){
    
    var d = new Date();
    let nwdate = {
        hour: d.getHours(),
        min:  d.getMinutes(),
        Day: d.getDate(),
        Month: d.getMonth(),
        year: d.getFullYear()
    }
    //console.log(nwdate);
    $.ajax({
        type: 'POST',
        url: base + '/time',
        data: JSON.stringify(nwdate),
        contentType : "application/json; charset=utf-8",
        success : function() {
            console.log('the date was updated successfully');
        },
        error : function(error) {
            console.log('there was an error in changing the date');
        },
    });
    // ala =  {
    //     t1:{tOn_h:1,tOn_m:0,dur:2,en:1,days:"0,1,1,0,0,0,1"},
    //     t2:{tOn_h:3,tOn_m:15,dur:5,en:1,days:"0,1,0,1,1,0,1"},
    //     t3:{tOn_h:16,tOn_m:30,dur:10,en:1,days:"0,1,1,0,0,0,1"}
    // }
    
    
    //get existing alarms already set on the esp
    $.ajax({
        type: 'GET',
        url: base + '/alarms',
        success : function(result) {
            console.log('Alarm values:',JSON.parse(result));
            ala = JSON.parse(result);
            $.each(ala, (i, elm)=>{
                let daysplit = elm.days.split(",");
                let alpweek = ['M','Tu','W', 'Th', 'F', 'Sa', 'Su'];
                let weektrans = [];
                for(let j=0; j < daysplit.length; j++){
                    //console.log( +daysplit[j] );
                    if(+daysplit[j]){ 
                        weektrans.push(alpweek[j]);
                    }
                }
               // ids.i = 1;
               ids.push(i);
                // let hours = elm.tOn_h; // gives the value in 24 hours format
                // let AmOrPm = hours >= 12 ? 'pm' : 'am';
                // hours = (hours % 12) || 12;
                // let minutes = elm.tOn_m ;
                let finalTime =  elm.tOn_h + ":" + elm.tOn_m; 
        
                // let scheclm = `<tr class="schedule"><td> ${weektrans.toString()} </td><td> ${finalTime} for ${elm.dur} min</td><td class="action-btns">
                // <a href="#" class="delete-schedule"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M18 19a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4V4h4.5l1-1h4l1 1H19v3h-1v12zM6 7v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V7H6zm12-1V5h-4l-1-1h-3L9 5H5v1h13zM8 9h1v10H8V9zm6 0h1v10h-1V9z" fill="currentColor"/></svg></a></td></tr>`;
                attachschedule(weektrans,finalTime,elm.dur,i);
                weektrans = [];
                //attachschedule(scheclm);
            });
        },
        error : function(error) {
            console.log('there was an error in updating the alarm');
        },
    });
    

});

//power button
$('.power-button').on('click',function(){
   let offstate = $('.off-state');
   
   if(offstate.css("visibility") == 'visible'){
    state = 1;
    offstate.css("visibility","hidden");
   }else{
    state = 0;   
    offstate.css("visibility", "visible");
   }
   $.ajax({
    type: 'GET',
    url: base + '/control?state='+state,
    success : function() {
        console.log('Light state');
    },
    error : function(error) {
        console.log('there was an error in changing light state');
    },
    });
});

var modal = $(".modal");
// When the user clicks the button, open the modal 
$('.add-label').on('click', function(){
  modal.css("display", "block");
});

// When the user clicks on <span> (x), close the modal
$('.close-addmodal').on('click', function(){
    modal.css("display", "none");
});

//close modal on window click
$(window).on('click', function(event) {
    if ($(event.target).hasClass("modal"))  modal.css("display", "none");
  });

//modal functionality day of the week selector
$('.dayofweek').on('click', function(e){
    //console.log(e.target.classList[0]);
    let tarelm = e.target;
    var clicked = tarelm.classList[0];
    var chk = $('.checkbox-con').find('.'+clicked);
    if(chk.is(":checked")){
        chk.prop("checked", false);
        $(tarelm).removeClass("selected");
    }else{
        chk.prop("checked", true);
        $(tarelm).addClass("selected");
    }
});

//function to save on modal

$('#add-btn').on('click', function(e){
      e.preventDefault();
      let week = false;
      let time = false;
      let period = false;
      let weekval = [];
      let timeval;
      let periodval;
      let binweeks = [];//week in binary
      //let weeks = ['M','Tu','W','Th', 'F','Sa','Su']
      var form = $(e.currentTarget).parent().parent();
      form.find('.checkbox-con input').each( (i,elm) => {   
        if($(elm).is(":checked")){ 
          week = true; 
          binweeks.push(1); //elm.classList[0]
          weekval.push(elm.classList[0]);
        }else{
          binweeks.push(0);
        }
      });
      time = Boolean(form.find('#appt').val());
      period = $('#period').val() != 0;
       // tOn_h:1,
        // tOn_m:0,
        // dur:2,
        // en:1,
        // days:"0,1,1,0,0,0,1"},
      if(week && time && period){
          timeval = form.find('#appt').val();
          timeval = timeval.split(":");
          periodval = $('#period').val();
          fschedule = {
            "days": binweeks.toString(),
            "tOn_h": +timeval[0],
            "tOn_m": +timeval[1],
            "en":1,
            "dur" : +periodval,//+ coerces the string to numeric primitive
          }
          addalarmobj(fschedule,weekval,timeval,periodval);
         // console.log(fschedule);

          
          

         }
      
});
function addalarmobj(almobj,week,time,period){
    //Object.keys(ids).length
    console.log(ids.length);
    let tid = ["t1","t2","t3"];
    if( 3 > ids.length ){
        for(k=0;k < 3; k++ ){
            let ctid = tid[k];
            //console.log($.inArray( ctid, ids ));
            let ind = $.inArray( ctid, ids )
            if(ind == -1){
               // console.log(ctid);
                fschedulearr[ctid] = almobj;
                attachschedule(week,time,period,ctid);
                break;
            }
        }
    }
    // $('#modalschedule tbody tr.schedule').each(function(m,elm){
    //     console.log($(elm).attr('id'));
    // });
}
 function attachschedule(week,time,period,i){
    let elm = `<tr id="${i}" class="schedule"><td> ${week.toString()} </td><td> ${time} for ${period} min</td><td class="action-btns">
    <a href="#" class="delete-schedule"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M18 19a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4V4h4.5l1-1h4l1 1H19v3h-1v12zM6 7v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V7H6zm12-1V5h-4l-1-1h-3L9 5H5v1h13zM8 9h1v10H8V9zm6 0h1v10h-1V9z" fill="currentColor"/></svg></a></td></tr>`;
    
    if($('#modalschedule tbody tr').length < 3){
        //console.log($('#modalschedule .notset').length);
        if($('#modalschedule .notset').length){
          $('#modalschedule tbody').html(elm) ;
        }else{
          document.querySelector('#modalschedule tbody').innerHTML += elm;
        }
      }
}

var notsetelm = '<tr class="notset"><td colspan="3" style="text-align:center">Not Set </td> '
// $(document).ready(function(){
//     console.log($('#schedule tbody tr.schedule').length);
// });
if(!$('#schedule tbody tr.schedule').length) {//when no schedules are present
  $('#schedule tbody').html(notsetelm)
  $('#main-schedule table').css("width" , "80%");
  $('#modalschedule tbody').html(notsetelm)
  $('.modal-rowschdule table').css("width", "100%");
} 

// var chconall = document.querySelectorAll('.checkbox-con input');
// chconall.forEach(element => console.log(element.classList[0], element.checked));

var settime = document.querySelector('#appt');
var period = document.querySelector('#period');

//for save
$('.save-addmodal').on('click', function(e){
    //console.log(!$('#modalschedule .notset').length, $('#modalschedule tbody tr.schedule').length);
    if(!$('#modalschedule .notset').length && $('#modalschedule tbody tr.schedule').length){
        console.log('saving...')
        let nclone =  $('#modalschedule tbody').clone();
        $('#schedule tbody').remove();
        $(nclone).appendTo('#schedule');
        modal.css("display", "none");
        console.log('ala', ala);
        console.log('fschedulearr', fschedulearr);
        if(fschedulearr.t1) ala.t1 = fschedulearr.t1;
        if(fschedulearr.t2) ala.t2 = fschedulearr.t2;
        if(fschedulearr.t3) ala.t3 = fschedulearr.t3;
        console.log('ala', ala);
        savealarm();
    }
  });

//for delete on modal
$('#modalschedule').on('click', function(e){
 // console.log();
  if($(e.target).parent().attr('class') == 'delete-schedule'){
      let tbr =  $(e.target).parent().parent().parent();
      let tbrid = tbr.attr("id");
      ids.splice(ids.indexOf(tbrid), 1);
      delete ala.tbrid;
        tbr.remove();
  }
  if( !($('#modalschedule tbody').children().length > 0) ){//check if has children
    $('#modalschedule tbody').html(notsetelm); 
  }
});

//for delete on mainpage
$('#schedule').on('click', function(e){
  if($(e.target).attr('class') == 'delete-schedule'){
   // $('#schedule tbody').remove();
   let tbr = $(e.target).parent().parent();
    tbr.remove();
    let nclone =  $('#schedule tbody').clone();
    let tbrid = tbr.attr("id");
    ids.splice(ids.indexOf(tbrid), 1);
    delete ala.tbrid;
    $('#modalschedule tbody').remove();
    $('#modalschedule').append(nclone);
    //console.log();
    savealarm();
  }
  if( !($('#schedule tbody').children().length > 0) ){//check if has children
    $('#schedule tbody').html(notsetelm); 
  }
  //add code here to update the backend
});


function savealarm(){
    console.log('saving alarms',ala)
    $.ajax({
        type: 'POST',
        url: base + '/time',
        data: JSON.stringify(ala),
        contentType : "application/json; charset=utf-8",
        success : function() {
            console.log('the alarm was saved successfully');
        },
        error : function(error) {
            console.log('there was an error in saving the alarm');
        },
    });
}