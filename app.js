var questionOptions = [];
var currentType = "";
var currentQuestion = {};
var currentSurvey = {};

$(document).ready(function() {
	setUpEventListeners();
	currentSurvey = new survey();
})

function setUpEventListeners() {
	//Main question type select
	$('#questionType').on('change',questionTypeSelect)
	$('#questionCreateForm').on('click','#nextButton',addQuestionOption)
	$('#questionCreateForm').on('click','#doneButton',addQuestionToSurvey)
	$('#viewSurvey').on('click',appendSurveyToView)
	$("#finalSurvey").submit(function(event) {
		event.preventDefault();
		console.log('sub');
		$.ajax({
			type: "POST",
			url: "index.html#surveyResults",
			data: $("finalSurvey").serialize(),
			success: function(data) {
				console.log("SUCCESS",data);
			}
		})
	})
}

// Event Listeners

function questionTypeSelect() {
	$('#newQuestion').replaceWith('<div id="newQuestion"></div>')
	currentQuestion = new surveyQuestion($('#questionType').val())
	currentQuestion.appendQuestionForm();
}

function addQuestionOption() {
	// validation for option
	if ($('#option').val() === "") {
		alert("Please enter an option");
	} else {
		currentQuestion.addOption();
	}
}

function addQuestionToSurvey() {
	if ($('#title').val() === "") {
		alert("Please enter a title");		
	} else {
		currentQuestion.addToSurvey();
		$('#questionCount').html(currentSurvey.questions.length); 
	}
}

function appendSurveyToView() {
	currentSurvey.appendSurvey();
}

function submitSurveyResults() {
	console.log('survey submit');
	// currentSurvey.submitSurvey();
}

//clear utility function

function clearQuestionForm() {
	$('#newQuestion').replaceWith('<div id="newQuestion"></div>')
	questionOptions = [];
}

// Survey object constructor
function survey() {
	this.questions = [];
}

survey.prototype = {
	appendSurvey: function() {
		var $form = $("<form></form>");
		var questionCounter = 1;
		for (var i=0;i<this.questions.length;i++) {
			$('#finalSurvey').append("<h2>"+this.questions[i].title+"</h2")
			if (this.questions[i].type === "radio") {
				for (var o=0;o<this.questions[i].options.length;o++) {
					$("<label></label>")
						.attr("for",this.questions[i].options[o]+questionCounter)
						.text(this.questions[i].options[o])
						.appendTo("#finalSurvey");
					 $("<input type='radio' value='' />")
				     .attr("value", this.questions[i].options[o])
				     .attr("name", "question"+questionCounter)
				     .attr("class","input-element")
				     .attr("id", this.questions[i].options[o]+questionCounter)
				     .appendTo('#finalSurvey');
				}
			} else if (this.questions[i].type === "check-box") {
				for (var o=0;o<this.questions[i].options.length;o++) {
					$("<label></label>")
						.attr("for",this.questions[i].options[o]+questionCounter)
						.text(this.questions[i].options[o])
						.appendTo("#finalSurvey");
					$("<input type='checkbox' value='' />")
					 .attr("value", this.questions[i].options[o])
					 .attr("name", "question"+questionCounter)
					 .attr("class","input-element")
					 .attr("id", this.questions[i].options[o]+questionCounter)
					 .appendTo('#finalSurvey');
					$("<br>").appendTo('#finalSurvey');
				}
			} else if (this.questions[i].type === "drop-down") {
				var $select = $('<select></select>');
				for (var o=0;o<this.questions[i].options.length;o++) {
					$select.append($("<option></option>")
	         .attr("value",this.questions[i].options[o])
	         .text(this.questions[i].options[o]));
				}
				$select.appendTo('#finalSurvey');
			} else if (this.questions[i].type === "text") {
				$("<input type='text' value='' />")
					 .attr("name", "question"+questionCounter)
					 .attr("id", this.questions[i].title)
					 .appendTo('#finalSurvey');
			}
			$("<br>").appendTo('#finalSurvey')
			$("<input type='submit' value='Submit Survey' />")
				.attr("id","surveySubmit")
				.attr('class',"submit-button")
				.appendTo('#finalSurvey');
		}
	},
	submitSurvey: function() {

	}
}

//Survey question object constructor
function surveyQuestion(type) {
	this.type = type;
	this.options = [];
	this.title = "";
}

surveyQuestion.prototype = {
	addToSurvey: function() {
		if (this.type == 'text') {
			this.title = $('#title').val();
		}
		currentSurvey.questions.push(this)
		//reset to defaults
		clearQuestionForm();
		$('#questionType').val(0);
	},
	appendQuestionForm: function() {
		$('#newQuestion').append("<p>Question Title</p>")
		$('#newQuestion').append("<input type='text' id='title'>")
		//Options
		if (this.type != 'text') {
			$('#newQuestion').append("<p>Option</p>")
			$('#newQuestion').append("<input type='text' id='option'>")
			$('#newQuestion').append("<button type='button' id='nextButton'>Next</button>")
		}
		$('#newQuestion').append("<button type='button' id='doneButton'>Done</button>")
	},
	addOption: function() {
		//if first option, add type of input and title for use later
		if(this.title === "") {
			this.title = $('#title').val();
		}
		this.options.push($('#option').val());
		$('#option').replaceWith("<input type='text' id='option'>");
	}
}

