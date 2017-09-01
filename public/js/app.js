/* globals options, DayPicker, Day, Options $ */

$(function(){
  $.get('/days')
    .then(function(days){
      var map = new Map('map');
      var idx = 0;


      //function which renders options
      function renderOptions(){
        Options({
          id: '#options',
          day: days[idx],
          options: options,
          addItem: function(obj){
            //only one hotel please.
            if(obj.key === 'hotels' && days[idx].hotels.length === 1){
              return;
            }
            var item = options[obj.key].find(function(item){
              return item.id === obj.id;
            });
            //TODO - ajax call to add on server
            $.post(`/days/${ days[idx].id }/restaurants/${ item.id }`);
            $.post(`/days/${ days[idx].id }/hotels/${ item.id }`);
            $.post(`/days/${ days[idx].id }/activities/${ item.id }`);
            renderDayAndOptions();
          }
        });
      }

      //function which renders our day  picker
      function renderDayPicker(){
        var addDay = function(){
          $.post('/days')
            .then(function(day){
                days.push({
                  id: day.id,
                  hotels: [],
                  restaurants: [],
                  activities: [],
                });
                idx = days.length - 1;
                renderDayPicker();
            });
        }

        var removeDay = function(){
          if(days.length === 1){
            return;
          }
          //TODO - remove the day on server
          // console.log('removeDay idx = ', ++idx);
          var dayPlusOne = idx + 1;
          $.ajax({ url: `/days/${ dayPlusOne }`, type: 'DELETE' })
            .then(result => {
              // days = days.filter(function(day, _idx){
              //   return _idx !== idx;
              // });
              idx = 0;
              renderDayPicker();
            })
            .catch(err => {
              console.log('err in ajax delete = ', err);
            });

        }

        var selectDay = function(_idx){
          idx = _idx;
          renderDayPicker();
        }

        DayPicker({
          id: '#dayPicker',
          days: days,
          idx: idx,
          addDay,
          removeDay,
          selectDay
        });
        renderDayAndOptions();
      }

      function renderDayAndOptions(){
        map.setMarkers(days[idx]);
        renderDay();
        renderOptions();
      }

      //this function render day
      function renderDay(){
        var onRemoveItem = function(obj){
          // days[idx][obj.key] = days[idx][obj.key].filter(function(item){
            // return item.id !== obj.id;
          // });
          $.ajax({ url: `/days/${ days[idx].id }/restaurants/${ obj.id }`, type: 'DELETE' });
          renderDayAndOptions();
        };
        //TODO - update on server
        Day({
          id: '#day',
          day: days[idx],
          options,
          onRemoveItem
        });
      }

      renderDayPicker();

    })


});
