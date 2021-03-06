// Get references to page elements
const $exampleText = $("#example-text");
const $exampleDescription = $("#example-description");
const $submitBtn = $("#submit");
const $exampleList = $("#example-list");

// The API object contains methods for each kind of request we'll make
const API = {
  saveExample(example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/examples",
      data: JSON.stringify(example)
    });
  },
  getExamples() {
    return $.ajax({
      url: "api/examples",
      type: "GET"
    });
  },
  deleteExample(id) {
    return $.ajax({
      url: `api/examples/${id}`,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
const refreshExamples = () => {
  API.getExamples().then(data => {
    const $examples = data.map(example => {
      const $a = $("<a>")
        .text(example.text)
        .attr("href", `/example/${example.id}`);

      const $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      const $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
// NOTE When writing jQuery event handlers, if we want `this` to refer to the
// DOM element, we cannot use arrow functions.
function handleFormSubmit(event) {
  event.preventDefault();

  const example = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim()
  };

  if (!(example.text && example.description)) {
    alert("You must enter an example text and description!"); // eslint-disable-line
    return;
  }

  API.saveExample(example).then(() => {
    refreshExamples();
  });

  $exampleText.val("");
  $exampleDescription.val("");
}

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
function handleDeleteBtnClick() {
  const idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(() => {
    refreshExamples();
  });
}

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);
