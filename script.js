
// Function load Single pokemon
var loaded_pokemon_list = [];
var filt_pokemons = [];


function loadSinglePokemon(id, top_offset){
    var pokemon4ik = loaded_pokemon_list[id];
    var about_types = createTypeList(pokemon4ik.types);

    var lenger = ((pokemon4ik.pkdx_id).toString()).length;
    var id_type = "";

    switch (lenger) {
        case 1:
            id_type = "00"+  pokemon4ik.pkdx_id.toString();
            break;
        case 2:
            id_type = "0" +  pokemon4ik.pkdx_id.toString();
            break;
        default:
            id_type =  pokemon4ik.pkdx_id.toString();
    }


    var container = $('#info_template').clone().removeAttr('id').removeAttr('style');

    container.find('.image_val').attr('src', 'http://pokeapi.co/media/img/'+pokemon4ik.pkdx_id+'.png');
    container.find('.name_val').html(pokemon4ik.name + " #" + id_type);
    container.find('.type_val').html(about_types);
    container.find('.att_val').html(pokemon4ik.attack);
    container.find('.def_val').html(pokemon4ik.defense);
    container.find('.hp_val').html(pokemon4ik.hp);
    container.find('.spa_val').html(pokemon4ik.sp_atk);
    container.find('.spd_val').html(pokemon4ik.sp_def);
    container.find('.speed_val').html(pokemon4ik.speed);
    container.find('.wgt_val').html(pokemon4ik.weight);
    container.find('.total_val').html(pokemon4ik.moves.length);

    $("#info").html(container.html()).css('top', top_offset);

}

function createTypeList(types) {
    var about_types = [];

    for( i in types) {
        about_types += '<span class="' + types[i].name + '">' + types[i].name + '</span> ';
        //about_types += types[i].name;
        filt_pokemons.push(types[i].name);
    }
    return about_types;

}

function filterPokemonList(word) {
    var selector = '.'+word;
    $('.box').each(function(){
        if (!word || !word.length) {
            $(this).css('display', 'block');
            $('#filter_types').find('button').attr('data-active', 'false').removeAttr('id');
            $('#filter_types').find('button:first').attr('data-active', 'true').attr('id', 'active');
        } else {
            $('#filter_types').find('button').attr('data-active', 'false').removeAttr('id');
            $('#filter_types').find('.'+word).attr('data-active', 'true').attr('id', 'active');
            if ($(this).find(selector).length) {
                $(this).css('display', 'block');
            } else {
                $(this).css('display', 'none');
            }
        }

    });
}

function loadPokemons(poks_limit) {
    $.ajax({
        url: 'http://pokeapi.co/api/v1/pokemon',
        data: {limit: poks_limit},
        success: function (data) {
            var pokemons = data.objects;

            var list_pokemons = "";

            var list_pokemons_types = '<button onclick="filterPokemonList();" class="" data-active="true">All</button>';


            for (var i in pokemons) {
                var pokemon4ik = pokemons[i];
                loaded_pokemon_list[pokemon4ik.pkdx_id] = pokemon4ik;
                var types_pokemon = createTypeList(pokemon4ik.types);

                list_pokemons += "<div class='box'  data-pokemon-id='" + pokemon4ik.pkdx_id + "'><div class='container'>"
                    + '<div class="imgs"><img src="http://pokeapi.co/media/img/' + pokemon4ik.pkdx_id +'.png"></div>'
                    + '<h5>' + pokemon4ik.name + '</h5>'
                    + '<span class="about">' + types_pokemon + '</span>'
                    + "</div></div>";


            }
            document.getElementById("content").innerHTML = list_pokemons;
            var current_filter = $("#filter_types button[data-active='true']").attr('class');

            filters_types_pocemons = $.unique(filt_pokemons);

            for (var x in filters_types_pocemons){
                list_pokemons_types += '<button class="' + filters_types_pocemons[x] + '" onclick="filterPokemonList(\'' + filters_types_pocemons[x] + '\');" data-active="false"><span>'+filters_types_pocemons[x]+'</span></button>';
            }
            document.getElementById("filter_types").innerHTML = list_pokemons_types;
            filterPokemonList(current_filter);

        },
        error: function () {
            console.log("Not fond more pokemons");
        }
    });
}

jQuery(document).ready(function () {

    loadPokemons(12);

    $('.list_pokemon').on('click', '.container', function () {

        $('.about_pokemon').css({'display':'block'});
        var box_pokemon = $(this).parents('.box');
        var pokemon_id = box_pokemon.data("pokemon-id");

        var box_offset = box_pokemon.offset();
        loadSinglePokemon(pokemon_id, box_offset.top);
    });
    $('.load_btn').on('click', function () {
        var exists = $('#content').find('.box');
        var newlimit = exists.length;
        loadPokemons(newlimit + 12);
    });
});
