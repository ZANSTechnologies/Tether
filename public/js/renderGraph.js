// contacts: array of {FirstName, LastName, Phone, Email, ID} from SearchContacts.php
function renderContactGraph(contacts)
{
    const container = document.getElementById("contactGraph");

    // Clear previous render.
    container.innerHTML = "";

    const W = container.clientWidth;
    const H = container.clientHeight;

    // Build node and link arrays.
    const nodes = [
        { id: "user", label: firstName + " " + lastName + "\n(YOU!)", type: "user" },
        ...contacts.map(c => ({
            id: "c" + c.ID,
            label: c.FirstName + " " + c.LastName,
            phone: c.Phone,
            email: c.Email,
            type: "contact"
        }))
    ];

    const links = contacts.map(c => ({ source: "user", target: "c" + c.ID }));

    const svg = d3.select("#contactGraph").append("svg")
        .attr("width", W)
        .attr("height", H)
        .style("overflow", "visible");

    // defs for gradients and filters
    const defs = svg.append("defs");

    // setup wisp filter
    const wispFilter = defs.append("filter")
        .attr("id", "wisp")
        .attr("x", "-20%").attr("y", "-20%")
        .attr("width", "140%").attr("height", "140%");
    wispFilter.append("feGaussianBlur")
        .attr("in", "SourceGraphic")
        .attr("stdDeviation", "1.4")
        .attr("result", "blur");

    // setup glow filter
    const glowFilter = defs.append("filter")
        .attr("id", "glow")
        .attr("x", "-40%").attr("y", "-40%")
        .attr("width", "180%").attr("height", "180%");
    glowFilter.append("feGaussianBlur")
        .attr("in", "SourceGraphic")
        .attr("stdDeviation", "4")
        .attr("result", "coloredBlur");

    // setup user node gradient (blue marble).
    const userGrad = defs.append("radialGradient")
        .attr("id", "gradUser")
        .attr("cx", "38%").attr("cy", "32%").attr("r", "60%");
    userGrad.append("stop").attr("offset", "0%")
        .attr("stop-color", "#91def5").attr("stop-opacity", "0.95");
    userGrad.append("stop").attr("offset", "55%")
        .attr("stop-color", "#84c7db").attr("stop-opacity", "0.75");
    userGrad.append("stop").attr("offset", "100%")
        .attr("stop-color", "#75b0c2").attr("stop-opacity", "0.85");

    // setup contact node gradient (white bubble).
    const contactGrad = defs.append("radialGradient")
        .attr("id", "gradContact")
        .attr("cx", "38%").attr("cy", "32%").attr("r", "60%");
    contactGrad.append("stop").attr("offset", "0%")
        .attr("stop-color", "#ffffff").attr("stop-opacity", "0.95");
    contactGrad.append("stop").attr("offset", "55%")
        .attr("stop-color", "#dddddd").attr("stop-opacity", "0.72");
    contactGrad.append("stop").attr("offset", "100%")
        .attr("stop-color", "#a1a1a1").attr("stop-opacity", "0.82");

    // zoom target
    const g = svg.append("g");

    // allow for zoom and pan.
    svg.call(
        d3.zoom()
            .scaleExtent([0.2, 4])
            .on("zoom", e => g.attr("transform", e.transform))
    );

    // force sim
    const sim = d3.forceSimulation(nodes)
        .force("link",      d3.forceLink(links).id(d => d.id).distance(125))
        .force("charge",    d3.forceManyBody().strength(-300))
        .force("center",    d3.forceCenter(W / 2, H / 2))
        .force("collision", d3.forceCollide(35))
        .alphaDecay(0.025);

    // wisp links
    const link = g.append("g").selectAll("path")
        .data(links).enter().append("path")
        .attr("fill", "none")

    // node group
    const node = g.append("g").selectAll("g")
        .data(nodes).enter().append("g")
        .attr("cursor", "pointer")
        .call(
            d3.drag()
                .on("start", (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
                .on("drag",  (e, d) => { d.fx = e.x; d.fy = e.y; })
                .on("end",   (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
        );

    // Glass bubble.
    node.append("circle")
        .attr("r",    d => d.type === "user" ? 24 : 16)
        .attr("fill", d => d.type === "user" ? "url(#gradUser)" : "url(#gradContact)")
        .attr("stroke",       "rgba(255,255,255,0.65)")
        .attr("stroke-width", 1.5);

    // highlight in bubble.
    node.append("ellipse")
        .attr("rx",   d => d.type === "user" ? 7  : 5)
        .attr("ry",   d => d.type === "user" ? 4  : 3)
        .attr("cx",   d => d.type === "user" ? -7 : -5)
        .attr("cy",   d => d.type === "user" ? -9 : -6)
        .attr("fill", "rgba(255,255,255,0.55)")
        .attr("pointer-events", "none");

    // Label text.
    node.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", d => d.type === "user" ? 40 : 30)
        .attr("font-size", "11.5px")
        .attr("font-family", "'Frutiger', 'Helvetica Neue', Arial, sans-serif")
        .attr("font-weight", "500")
        .attr("letter-spacing", "0.02em")
        .attr("fill", "#2b2f44d7")
        .attr("pointer-events", "none")
        .text(d => d.label);

    // On click. FIXME
    node.on("click", (e, d) =>
    {
        if (d.type === "contact")
        {
            document.getElementById("contactDetail").innerHTML =
                "<strong>" + d.label + "</strong><br>" +
                d.phone + "<br>" + d.email;
        }
    });

    // simulation update.
    sim.on("tick", () =>
    {
        link.attr("d", d =>
        {
            const mx = (d.source.x + d.target.x) / 2;
            const my = (d.source.y + d.target.y) / 2;

            // Perpendicular offset for the Bézier control point — gives each
            // link a gentle bow without looking chaotic.
            const dx = d.target.x - d.source.x;
            const dy = d.target.y - d.source.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const bend = len * 0.12;          // bow magnitude, ~12% of length
            const cpx = mx - (dy / len) * bend;
            const cpy = my + (dx / len) * bend;

            return `M${d.source.x},${d.source.y} Q${cpx},${cpy} ${d.target.x},${d.target.y}`;
        });

        node.attr("transform", d => `translate(${d.x},${d.y})`);
    });
}