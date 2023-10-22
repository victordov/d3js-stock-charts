function toSlice(data) { return data.slice(-TDays[TPeriod]); }

function mainjs() {
    var toPress    = function() { genData = (TIntervals[TPeriod]!="day")?dataCompress(toSlice(genRaw), TIntervals[TPeriod]):toSlice(genRaw);
        bobData = toSlice(bobRaw); crrData = toSlice(crrRaw); };
    toPress(); displayAll();
    d3.select("#oneM").on("click",   function(){ TPeriod  = "1M"; toPress(); displayAll(); });
    d3.select("#threeM").on("click", function(){ TPeriod  = "3M"; toPress(); displayAll(); });
    d3.select("#sixM").on("click",   function(){ TPeriod  = "6M"; toPress(); displayAll(); });
    d3.select("#oneY").on("click",   function(){ TPeriod  = "1Y"; toPress(); displayAll(); });
    d3.select("#twoY").on("click",   function(){ TPeriod  = "2Y"; toPress(); displayAll(); });
    d3.select("#fourY").on("click",  function(){ TPeriod  = "4Y"; toPress(); displayAll(); });
    d3.select("#bobSel").on("click", function(){ TOverlay = (TOverlay=="bob")?"none":"bob"; displayAll(); });
    d3.select("#aurSel").on("click", function(){ TOverlay = (TOverlay=="aur")?"none":"aur"; displayAll(); });
    d3.select("#crrSel").on("click", function(){ TOverlay = (TOverlay=="crr")?"none":"crr"; displayAll(); });
}

function displayAll() {
    changeClass();
    displayCS();
    displayGen(genData.length-1);
    displayBob(bobData.length-1);
    d3.select("#crrname").text("StatArb-Nifty");
    displayCrr(crrData.length-1);
}

function changeClass() {
    if (TOverlay =="bob") {
        d3.select("#bobSel").classed("active", true);
        d3.select("#aurSel").classed("active", false);
        d3.select("#crrSel").classed("active", false);
    } else if (TOverlay =="aur") {
        d3.select("#bobSel").classed("active", false);
        d3.select("#aurSel").classed("active", true);
        d3.select("#crrSel").classed("active", false);
    } else if (TOverlay =="crr") {
        d3.select("#bobSel").classed("active", false);
        d3.select("#aurSel").classed("active", false);
        d3.select("#crrSel").classed("active", true);
    } else {
        d3.select("#bobSel").classed("active", false);
        d3.select("#aurSel").classed("active", false);
        d3.select("#crrSel").classed("active", false);
    }
    if (TPeriod =="1M") {
        d3.select("#oneM").classed("active", true);
        d3.select("#threeM").classed("active", false);
        d3.select("#sixM").classed("active", false);
        d3.select("#oneY").classed("active", false);
        d3.select("#twoY").classed("active", false);
        d3.select("#fourY").classed("active", false);
    } else if (TPeriod =="6M") {
        d3.select("#oneM").classed("active", false);
        d3.select("#threeM").classed("active", false);
        d3.select("#sixM").classed("active", true);
        d3.select("#oneY").classed("active", false);
        d3.select("#twoY").classed("active", false);
        d3.select("#fourY").classed("active", false);
    } else if (TPeriod =="1Y") {
        d3.select("#oneM").classed("active", false);
        d3.select("#threeM").classed("active", false);
        d3.select("#sixM").classed("active", false);
        d3.select("#oneY").classed("active", true);
        d3.select("#twoY").classed("active", false);
        d3.select("#fourY").classed("active", false);
    } else if (TPeriod =="2Y") {
        d3.select("#oneM").classed("active", false);
        d3.select("#threeM").classed("active", false);
        d3.select("#sixM").classed("active", false);
        d3.select("#oneY").classed("active", false);
        d3.select("#twoY").classed("active", true);
        d3.select("#fourY").classed("active", false);
    } else if (TPeriod =="4Y") {
        d3.select("#oneM").classed("active", false);
        d3.select("#threeM").classed("active", false);
        d3.select("#sixM").classed("active", false);
        d3.select("#oneY").classed("active", false);
        d3.select("#twoY").classed("active", false);
        d3.select("#fourY").classed("active", true);
    } else {
        d3.select("#oneM").classed("active", false);
        d3.select("#threeM").classed("active", true);
        d3.select("#sixM").classed("active", false);
        d3.select("#oneY").classed("active", false);
        d3.select("#twoY").classed("active", false);
        d3.select("#fourY").classed("active", false);
    }
}

function displayCS() {
    var chart       = cschart().Bheight(460).overlay(TOverlay);
    d3.select("#chart1").call(chart);
    var chart       = barchart().mname("volume").margin(320).MValue("TURNOVER");
    d3.select("#chart1").datum(genData).call(chart);
    var chart       = barchart().mname("sigma").margin(400).MValue("VOLATILITY");
    d3.select("#chart1").datum(genData).call(chart);
    hoverAll();
}

function hoverAll() {
    d3.select("#chart1").select(".bands").selectAll("rect")
        .on("mouseover", function(d, i) {
            d3.select(this).classed("hoved", true);
            d3.select(".stick"+i).classed("hoved", true);
            d3.select(".candle"+i).classed("hoved", true);
            d3.select(".volume"+i).classed("hoved", true);
            d3.select(".sigma"+i).classed("hoved", true);
            displayGen(i);
            if (TIntervals[TPeriod]=="day") {
                displayBob(i);
                displayCrr(i);
            }
        })
        .on("mouseout", function(d, i) {
            d3.select(this).classed("hoved", false);
            d3.select(".stick"+i).classed("hoved", false);
            d3.select(".candle"+i).classed("hoved", false);
            d3.select(".volume"+i).classed("hoved", false);
            d3.select(".sigma"+i).classed("hoved", false);
            displayGen(genData.length-1);
            if (TIntervals[TPeriod]=="day") {
                displayBob(bobData.length-1);
                displayCrr(crrData.length-1);
            }
        });
}

function displayGen(mark) {
    var header      = csheader();
    d3.select("#infobar").datum(genData.slice(mark)[0]).call(header);
    var sidech      = sbar().sname("vol").index(mark);
    d3.select("#Schart1").datum(genData).call(sidech);
    var sidetx      = sbarheader().sname("vol").index(mark);
    d3.select("#Schart1T").datum(genData).call(sidetx);
    var sidech      = sbar().sname("sig").index(mark);
    d3.select("#Schart2").datum(genData).call(sidech);
    var sidetx      = sbarheader().sname("sig").index(mark);
    d3.select("#Schart2T").datum(genData).call(sidetx);
}

function displayBob(mark) {
    var sidech      = sbar().sname("bob").index(mark);
    d3.select("#Schart3").datum(bobData).call(sidech);
    var sidetx      = sbarheader().sname("bob").index(mark);
    d3.select("#Schart3T").datum(bobData).call(sidetx);
    var sidech      = sbar().sname("aur").index(mark);
    d3.select("#Schart4").datum(bobData).call(sidech);
    var sidetx      = sbarheader().sname("aur").index(mark);
    d3.select("#Schart4T").datum(bobData).call(sidetx);
}

function displayCrr(mark) {
    var sidech      = sbar().sname("crr").index(mark);
    d3.select("#Schart5").datum(crrData).call(sidech);
    var sidetx      = sbarheader().sname("crr").index(mark);
    d3.select("#Schart5T").datum(crrData).call(sidetx);
}