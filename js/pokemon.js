/*----------------variables------------------*/

var delay_display_card = 500;
var time_over = 15000;
var nbr_deck = 1;
var deck_table = [];
var actual_card = 0;

/*----------------functions------------------*/

// add new pokemon card to the deck
function deck_cards(nbr_deck, deck_html) {
    
    $('#deck-card'+ nbr_deck).replaceWith('<div id="deck-card'+ nbr_deck +'" '+ deck_html).delay("slow");
}

//display pokemon cards
function display_cards(nbr_pokemons, pokemons_table) {
    var rdm_int = Math.floor((Math.random() * nbr_pokemons) + 0);
    var deck_already = false;

    //we verify if the pokemon has been already find
    for(var k = 0; k < nbr_deck; k++){
        if(rdm_int == deck_table[k]){
            deck_already = true;
        }
    }
    //else only not find cards are shown
    if(deck_already==false){
        actual_card = rdm_int;
        $(".pokemon-card").replaceWith('<div class="pokemon-card" '+ pokemons_table[rdm_int]).delay(delay_display_card);
    }
}
 
//while Stop button not pushed and delay < max delay , show pokemon cards
function loop(nbr_pokemons, pokemons_table, i, stop) {
    if(stop != true){
        timer = setTimeout(function() {  
            //display card
            display_cards(nbr_pokemons, pokemons_table);
            
            i++;  
            var actual_delay = delay_display_card*i ;
            //if actual delay is a second then we actualized the timer at the Stop div
            if(actual_delay % 1000 == 0){
                $(".stop").html('Stop ( '+ actual_delay/1000 +'s )');
            }
            //new instruction
            if (actual_delay < time_over) { 
                loop(nbr_pokemons, pokemons_table, i); 
            }  
          }, delay_display_card);
    }
    else{
        clearTimeout(timer);
        console.log('stopped')
    }
    
  }

/*----------------JQuery--------------------*/
$(document).ready(function() {
    var stop = false;
    var nbr_pokemons = 0;
    
    //table that gets all pokemons data
    var pokemons_table = [];

    //get data from API
    $.getJSON("https://pokeapi-enoki.netlify.app/", function (data) {
        console.log(data);
        var pokemons = data.pokemons;
        
        $.each(pokemons, function(i){

            var html_abilities = "";
            var html = "";

            //pokemons data
            var id = pokemons[i].id;
            var name = pokemons[i].name;
            var level = pokemons[i].level;
            var icon;
            var image = pokemons[i].image;
            var background_color = pokemons[i].background_color;
            var abilities = pokemons[i].abilities;

            $.each(abilities, function(j){
                var abilitiy_name = abilities[j].name;
                icon = abilities[j].icon;
                var abilitiy_power = abilities[j].power;
                var abilitiy_description = abilities[j].description;

                html_abilities+='<div class="abilities"><i>'+ icon +'</i><p class="ability-name">'+ abilitiy_name +'</p><p class="ability-power">'+ abilitiy_power +'</p><p class="ability-description">'+ abilitiy_description +'</p></div>';
            });

            html+='style="background-color:'+ background_color +';"><div class="card-top"><p class="name">'+ name +'</p><i>'+ icon +'</i><p class="level"><sub>Niv</sub>'+ level +'</p></div><button class="add-deck"><img src="'+ image +'" alt="Pokemon image"></button>';
            html+=html_abilities;
            html+='</div>';

            pokemons_table[i] = html;

            nbr_pokemons = i;
            
        });
        display_cards(nbr_pokemons, pokemons_table);
    });

    //start button : display random pokemon cards
    $(".start").click(function(){ 
            var i = 0;
            stop = false;

            loop(nbr_pokemons, pokemons_table , i, stop);
    });

    //stop button : stop the randomization of pokemon cards to get one
    $(".stop").click(function(){ 
        var i = 0;
        stop = true;

        loop(nbr_pokemons, pokemons_table , i, stop);
    });

    //add_deck button : add a new card in the deck
    $(document).on ("click", ".add-deck", function () {
        
        deck_table[nbr_deck-1] = actual_card;

        deck_cards(nbr_deck, pokemons_table[actual_card]);

        if(nbr_deck < 6){
            nbr_deck++;
        }
    });
});