$(function () {
  $('#addBtn').on('click', () => {
    let data = {};
    for (let input of $('#myForm')[0]) {
      data[input.name] = input.value;
    }
    data['table'] = $('#tableName')[0].outerText;
    $.ajax({
      type: "method",
      url: "/add",
      data: data,
      method: 'POST',
      success: (res) => {
        location.reload();
      },
      error: (res) => {
        console.error(res.error);
      }
    });
  })
});

function deleteItem(item) {
  let row = $(item).closest('tr');
  let index = row[0].cells[0].outerText;
  let data = {};
  data['table'] = $('#tableName')[0].outerText;
  data.index = index;
  $.ajax({
    type: "method",
    url: "/delete",
    data: data,
    method: 'POST',
    success: (res) => {
      location.reload();
    },
    error: (err) => {
      console.error(err);
    }
  });
  console.log(row);
}

function editItem(item) {
  console.log($('#addBtn'));
  let row = $(item).closest('tr')[0];
  let index = row.cells[0].outerText;
  for (let i = 0; i < $('#myForm')[0].length; i++) {
    $('#myForm')[0][i].value = row.cells[i + 1].outerText;
  }
  $('#addBtn').html('edit');
  $("#myButton").off('click');
  $('#addBtn').unbind('click');
  $('#addBtn').on('click', () => {
    let data = {};
    for (let input of $('#myForm')[0]) {
      data[input.name] = input.value;
    }
    data['index'] = index;
    data['table'] = $('#tableName')[0].outerText;
    $.ajax({
      type: "method",
      url: "/edit",
      data: data,
      method: 'POST',
      success: (res) => {
        location.reload();
      },
      error: (err) => {
        console.error(err);
      }
    });
  })
  $('#cancelSpan').show();
}

function cancel() {
  $('#addBtn').html('Submit');
  $('#addBtn').unbind('click');
  $('#addBtn').on('click', () => {
    let data = {};
    for (let input of $('#myForm')[0]) {
      data[input.name] = input.value;
    }
    data['table'] = $('#tableName')[0].outerText;
    $.ajax({
      type: "method",
      url: "/add",
      data: data,
      method: 'POST',
      success: (res) => {
        location.reload();
      },
      error: (res) => {
        console.error(res.error);
      }
    });
  })
  for (let input of $('#myForm')[0]) {
    input.value = "";
  }
  $('#cancelSpan').hide();
}
