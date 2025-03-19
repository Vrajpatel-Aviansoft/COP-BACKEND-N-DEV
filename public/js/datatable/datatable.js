
function initializeDataTable(selector, ajaxUrl, columns) {
const table = $(selector).DataTable({
  processing: true,
  serverSide: true,
  ajax: {
    url: ajaxUrl,
    data: function (d) {
      d.draw = d.draw || 1;
    },
    error: function (xhr, error, thrown) {
      console.error('Error fetching data: ', error);
      alert('An error occurred while fetching data. Please try again later.');
    },
  },
  columns: columns,
  language: {
    lengthMenu: 'Show _MENU_',
  },
  dom:
    "<'row mb-2'" +
    "<'col-sm-6 d-flex align-items-center justify-content-start dt-toolbar'l>" +
    "<'col-sm-6 d-flex align-items-center justify-content-end dt-toolbar'f>" +
    '>' +
    "<'table-responsive'tr>" +
    "<'row'" +
    "<'col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start'i>" +
    "<'col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'p>" +
    '>',
  drawCallback: function (settings) {
    const pageStart = settings._iDisplayStart;
    const pageLength = settings._iDisplayLength;
    table
      .column(0)
      .nodes()
      .each(function (cell, i) {
        const rowIndex = pageStart + i + 1; 
        $(cell).html(`<span style="font-size: 1rem;">${rowIndex}</span>`);
      });
  },
});

  return table;
}

function setupDeleteHandler(selector, table) {
  $(document).on("click", selector, function (e) {
    e.preventDefault();
    const deleteUrl = $(this).data("href");

    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: deleteUrl,
          method: "DELETE",
          success: function () {
            Swal.fire("Deleted!", "The item has been deleted.", "success");
            table.ajax.reload();
          },
          error: function () {
            Swal.fire("Error!", "An error occurred while deleting.", "error");
          },
        });
      }
    });
  });
}
