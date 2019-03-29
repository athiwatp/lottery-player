"use strict";


let spanNumbers = null;
let divBlocker = null;
let btnPlay = null;
let userNumbers = [];
let machineNumbers = [];
let matchedNumbers = [];
let numberOfTimesPlayed = 0;

window.addEventListener ("load", function ()
{
    spanNumbers = document.getElementsByClassName ("number");
    divBlocker = document.getElementById ("blocker");
    btnPlay = document.getElementById ("btnPlay");

    /* Events to "numbers" */
    for (let i = 0; i < spanNumbers.length; i++)
    {
        let element = spanNumbers[i];

        element.addEventListener ("click", function (e)
        {
            let number = parseInt (this.textContent);

            if (userNumbers.length < 6)
            {
                if (userNumbers.indexOf (number) === -1)
                {
                    userNumbers.push (number);
                    this.classList.add ("number-selected");
                    manipulateElement ("user", "create", this.textContent);
                }
                else 
                {
                    userNumbers.splice (userNumbers.indexOf (number), 1);
                    this.classList.remove ("number-selected");
                    manipulateElement ("user", "remove", this.textContent);
                }
            }
            else 
            {
                if (userNumbers.indexOf (number) > -1)
                {
                    userNumbers.splice (userNumbers.indexOf (number), 1);
                    this.classList.remove ("number-selected");
                    manipulateElement ("user", "remove", this.textContent);
                }
            }

            if (userNumbers.length === 6)
                btnPlay.disabled = false;
            else 
                btnPlay.disabled = true;
        });
    }

    btnPlay.addEventListener ("click", function (e)
    {
        /* Blocks and excludes some elements */
        this.disabled = true;
        numberOfTimesPlayed++;
        document.getElementById ("number_of_times_played").textContent = numberOfTimesPlayed;
        divBlocker.style.display = "block";
        document.querySelectorAll (".output-numbers.machine, .output-numbers.matched").forEach ((element) => element.remove ());

        if (document.querySelector ("#no_matches") !== null)
            document.querySelector ("#no_matches").remove ();

        document.querySelector ("#score_result h4").innerText = "";

        generateMachineNumbers ();
    });
});

/**
 * Generates six random numbers between 1 / 50
 */
function generateMachineNumbers ()
{
    machineNumbers = [];

    let ID = setInterval (function (e)
    {
        let number = Math.round (Math.random () * 50) + 1;

        /* Add to array and renders it */
        if (machineNumbers.indexOf (number) === -1)
        {
            machineNumbers.push (number);
            manipulateElement ("machine", "create", (number < 10 ? "0" + number : number));
        }

        if (machineNumbers.length === 6)
        {
            clearInterval (ID);
            compareNumbers (userNumbers, machineNumbers);
        }
    }, 500);
}

/**
 * Compares the user and machine arrays
 * @param {Array} user 
 * @param {Array} machine 
 */
function compareNumbers (user, machine)
{
    matchedNumbers = [];

    /* Compare it */
    machine.forEach ((value, index) => 
    {
        if (user.indexOf (value) > -1) matchedNumbers.push (value);
    });

    /* Render */
    let index = 0;

    let ID = setInterval (function (e)
    {
        if (matchedNumbers.length > 0)
        {
            manipulateElement ("matched", "create", (matchedNumbers[index] < 10 ? "0" + matchedNumbers[index] : matchedNumbers[index]));
            index++;
        }
        else 
        {
            index = 0;
            let div = document.createElement ("div");
            div.id = "no_matches";
            div.className = "col";
            div.innerHTML = "<h4> None </h4>"
            document.querySelector ("#matched_numbers .row").appendChild (div);
            document.querySelector ("#score_result h4").innerHTML = "You didn't score";
        }

        if (index === matchedNumbers.length) 
        {
            clearInterval (ID);

            if (index > 0)
            {
                let numberOfPoints = 10 * matchedNumbers.length;
                document.querySelector ("#score_result h4").innerHTML = `${numberOfPoints} points`;
            }

            btnPlay.disabled = false;
            divBlocker.style.display = "none";
        }
    }, 500);
}


/**
 * Create ou remove elements based on operator, action and value informed
 * @param {String} operator 
 * @param {String} action 
 * @param {String} value 
 */
function manipulateElement (operator, action, value)
{
    let rowID = (operator === "user" ? "#player_numbers .row" : (operator === "machine" ? "#machine_numbers .row" : "#matched_numbers .row"));

    let row = document.querySelector (rowID);

    if (action === "create")
    {
        let div = document.createElement ("div");
        div.id = value;
        div.className = "col output-numbers";
        div.className += (operator === "user" ? " user" : (operator === "machine" ? " machine" : " matched"));
        div.innerText = value;
        row.appendChild (div);
    }
    else 
    {
        let div = document.getElementById (value);
        row.removeChild (div);
    }
}