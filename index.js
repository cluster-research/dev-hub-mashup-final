/*
 * Basic responsive mashup template
 * @owner Enter you name here (xxx)
 */
/*
 *    Fill in host and port for Qlik engine
 */
var prefix = window.location.pathname.substr(
  0,
  window.location.pathname.toLowerCase().lastIndexOf("/extensions") + 1
);
var config = {
  host: window.location.hostname,
  prefix: prefix,
  port: window.location.port,
  isSecure: window.location.protocol === "https:",
};
require.config({
  baseUrl:
    (config.isSecure ? "https://" : "http://") +
    config.host +
    (config.port ? ":" + config.port : "") +
    config.prefix +
    "resources",
});

require(["js/qlik"], function (qlik) {
  qlik.setOnError(function (error) {
    $("#popupText").append(error.message + "<br>");
    $("#popup").fadeIn(1000);
  });
  $("#closePopup").click(function () {
    $("#popup").hide();
  });

  //callbacks -- inserted here --
  //open apps -- inserted here --
  var app = qlik.openApp("0aaa136d-eb71-4d60-90b0-2d8c266b07bc", config);
  //get objects -- inserted here --
	app.getObject('index-filter01','db7d8c37-3a6f-4aa5-8a06-dfafb0abf05c');
  app.getObject("page1-01", "fNGRa");
  //create cubes and lists -- inserted here --
  
  //elements
  var re = /\w+/;
  var currentPage = "";
  var qlikPages = document.querySelectorAll(".qlik-page");
  const mainContent = document.querySelector(".content-page");
  const body = document.querySelector("body");
  const clusterNavigation = document.querySelector(".menu-list");
  const menuLinks = document.querySelectorAll(".menu-item");
  const submenuLinks = document.querySelectorAll(".submenu-item");
  const buttonMoreFilters = document.querySelector("#more-filters");
  const rightMenu = document.querySelector(".navigation-right");
  const selectionsElement = document.querySelector("#selections");
  const clearAllButton = document.querySelector(".clear_selections");
  const buttonCurrentSelections = document.querySelector("#btn-selections");

  
  // mobile buttons
  const buttonMoreFiltersMobile = document.querySelector("#more-filters-mobile");
  const selectionsElementMobile = document.querySelector("#selectionsmobile");
  const mobileClearAllButton = document.querySelector(".filter-actions-mobile .clear_selections");
  const mobileSelectionsButton = document.querySelector(".filter-actions-mobile .btn-counter");
  const mobileSelectionsCounter = document.querySelector("#btn-selectionsmobile .counter");

  
	//page rendering functions
	if (!window.location.hash) {
		window.location.hash = "#" + qlikPages[0].getAttribute("id");
		setCurrentPage(window.location.hash);
	} else {
		renderPage(window.location.hash);
		setCurrentPage(window.location.hash);
	}
	
	window.addEventListener(
	"hashchange",
	function() {
		renderPage(window.location.hash);
		setCurrentPage(window.location.hash);
	}, false);
	
	function setCurrentPage(page) {
		currentPage = page;
	}
	
	function renderPage(page) {
		hideAllPages();
		setCurrentPage(page);
		scrollToTop();
		
		const pageIdWithoutHash =  re.exec(currentPage)[0];
		const pageContainer = document.getElementById(pageIdWithoutHash);
		if (pageContainer) {
			const targetLink = document.querySelector(`.menu-list a[href='${window.location.hash}']`);
			activateMenu(targetLink);
			showPage(pageIdWithoutHash);
			simulateWindowResize();
		} else {
			setCurrentPage("notfound");
			showPage("notfound");
		}
	}
	
	function simulateWindowResize() {
		setTimeout(function () {
		var resizeEvent = new Event("resize");
		window.dispatchEvent(resizeEvent);
		}, 300);
	}
	
	function hideAllPages() {
		for(var i = 0; i < qlikPages.length; i++) {
			if(qlikPages[i].classList.contains("active")) {
				qlikPages[i].classList.remove("active");
			}
		}
	}
	
	function showPage(pageId) {
		document.getElementById(pageId).classList.add("active");
	}
	
	function scrollToTop() {
		mainContent.scrollTop = 0;
	}
	
	function activateMenu(link) {
		if (isSubmenu(link)) {
			link.parentElement.parentElement.previousElementSibling.classList.add("active");
		}
		link.parentElement.classList.add("active");
	}
	
	function isSubmenu(link) {
		return link.parentElement.classList.contains("submenu-item");
	}
	
	// end page rendering functions 
	
	// start sidebar functions
	const burgerMenu = document.querySelector(".burger-menu");
	burgerMenu.addEventListener("click", function () {
		toggleNavigationMenu();
		simulateWindowResize();
	})
	
	function toggleNavigationMenu() {
		body.classList.toggle("nav-toggle");
	}
	
	clusterNavigation.addEventListener("click", function (evt) {
		if (evt.target.tagName == "A") {
			var menuLink = evt.target;
		}
		
		if (hasNoPage(menuLink)) {
			return;
		}
		
		if(isSubmenuToggle(menuLink)) {
			evt.preventDefault();
			handleSubmenuClick(menuLink);
			return;
		}
		
		clearAllMenuLinks();
		clearAllSubmenuLinks();
		activateMenu(menuLink);
		closeNavigationMenu();
	})
	
	
	function isSubmenuToggle(link) {
		return link.parentElement.classList.contains("has-submenu") &&
		link.parentElement.classList.contains("menu-item");
	}
	
	function clearAllMenuLinks() {
		for (var i = 0; i < menuLinks.length; i++) {
			if (menuLinks[i].classList.contains("active")) {
				menuLinks[i].classList.remove("active");
			}
		}
	}
	
	function clearAllSubmenuLinks() {
		for (var i = 0; i < submenuLinks.length; i++) {
			if (submenuLinks[i].classList.contains("active")) {
				submenuLinks[i].classList.remove("active");
				submenuLinks[i].parentElement.previousElementSibling.classList.remove("active");
			}
		}
	}
	
	function closeNavigationMenu() {
		body.classList.remove("nav-toggle");
	}
	
	function handleSubmenuClick(link) {
		link.nextElementSibling.classList.toggle("opened");
		link.parentElement.classList.toggle("submenu-opened");
	}
	
	function hasNoPage(link) {
		return link.classList.contains("no-page");
	}
	
	// end sidebar functions
	
	//start filterbar functions
	
	buttonMoreFilters.addEventListener("click", function () {
		toggleFiltersMenu();
	});
	
	buttonMoreFiltersMobile.addEventListener("click", function () {
		toggleFiltersMenu();
	});
	
	function toggleFiltersMenu() {
		rightMenu.classList.toggle("opened");
		body.classList.toggle("nav-right-toggle");
		simulateWindowResize();
	}
	
	$(".close-filters").on("click", function() {
		closeFilterSidebar();
	})
	
	function closeFilterSidebar() {
		if (body.classList.contains("nav-right-toggle")) {
			rightMenu.classList.remove("opened");
			body.classList.remove("nav-right-toggle");
		}
	}
	
	// end filterbar functions
	
	// start navbar functions
	
	$(".logout-btn").on("click", function() {
		logoutButton();
		window.location.reload(true);
	});
	
	function logoutButton() {
		$.ajax({
			type: "DELETE",
			url: "https://" + config.host + config.prefix + "qps/user",
			success: function() {
				window.location = "/";
			}
		})
	}
	
	//end navbar functions
	
	// start current selections
		if (app) {
			app.getList("CurrentSelections", function (reply) {
				const selections = reply.qSelectionObject.qSelections;
				console.log('selections', selections);
				setCurrentSelections(selections);
			})
		}
			
		function setCurrentSelections(selections) {
			let html = "";
			for(let i = 0; i < selections.length; i++) {
				const currentSelection = selections[i];
				const field = currentSelection.qField;
				const numSelected = currentSelection.qSelectedCount;
				const total = currentSelection.qTotal;
				const threshold = currentSelection.qSelectionThreshold;
				const selectedStr = currentSelection.qSelected;

				if (numSelected <= threshold) {
					html += `<li class="selected-field-container" id="${field}">`;
					html += `<span class="selected-field-label">${field}</span>`;
					html += `<div class="selected-field-value"> <span class="field-value">`;
					html += selectedStr;
					html += `</span> <i class="material-icons clear-field">&#xE872;</i></div></li>`;
				} else {
					html += `<li class="selected-field-container" id="${field}">`;
					html += `<span class="selected-field-label">${field}</span>`;
					html += `<div class="selected-field-value"> <span class="field-value">`;
					html += `${numSelected} of ${total}`;
					html += `</span> <i class="material-icons clear-field">&#xE872;</i></div></li>`;
				}					
			}

			selectionsElement.innerHTML = html;
			selectionsElementMobile.innerHTML = html;
			
			if (selections.length > 0) {
				activateSelectionsButtons();
			} else {
				deactivateSelectionsButtons();
			}
			
			$(".clear-field").click(function (evt) {
				if (selections.length === 1) {
					hideCurrentSelections();
				}
			
				const field = $(this).parent().parent().attr("id");
				app.field(field).clear();
				evt.stopPropagation();
			})
			
			const counterElement = document.querySelector("#btn-selections .counter");
			counterElement.innerHTML = selections.length;
			mobileSelectionsCounter.innerHTML = selections.length;
		}
		
		function hideCurrentSelections() {
			selectionsElement.classList.remove("visible");
			selectionsElementMobile.classList.remove("visible");
		}
		
		function activateSelectionsButtons() {
			clearAllButton.classList.remove("deactivated");
			buttonCurrentSelections.classList.remove("deactivated");
			mobileSelectionsButton.classList.remove("deactivated");
			mobileClearAllButton.classList.remove("deactivated");
		}
		
		function deactivateSelectionsButtons() {
			clearAllButton.classList.add("deactivated");
			buttonCurrentSelections.classList.add("deactivated");
			mobileSelectionsButton.classList.add("deactivated");
			mobileClearAllButton.classList.add("deactivated");
		}
		
		function showCurrentSelections() {
			selectionsElement.classList.toggle("visible");
		}
		
		function showCurrentSelectionsMobile() {
			selectionsElementMobile.classList.toggle("visible");
		}
		
		$(".btn-selections").on("click", function (evt) {
			showCurrentSelections();
			showCurrentSelectionsMobile();
			evt.stopPropagation();
		})
		
		$(".clear_selections").on("click", function() {
			app.clearAll();
		})
		
		body.addEventListener("click", function() {
			hideCurrentSelections();
		});
		
		$(".current-selections").on("click", function (evt) {
			evt.stopPropagation();
		})
			
	
	// end current selections
	
});



