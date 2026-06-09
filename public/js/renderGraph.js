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
        { id: "user", label: firstName + " " + lastName, type: "user" },
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
        .attr("height", H);

    // group SVG objects
    const g = svg.append("g");

    // Zoom and pan.
    svg.call(
        d3.zoom()
            .scaleExtent([0.2, 4])
            .on("zoom", e => g.attr("transform", e.transform))
    );

    // Force simulation.
    const sim = d3.forceSimulation(nodes)
        .force("link",      d3.forceLink(links).id(d => d.id).distance(130))
        .force("charge",    d3.forceManyBody().strength(-350))
        .force("center",    d3.forceCenter(W / 2, H / 2))
        .force("collision", d3.forceCollide(40))
        .alphaDecay(0.025);

    // Draw edges first so they sit under the nodes.
    const link = g.append("g").selectAll("line")
        .data(links).enter().append("line")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 1);

    // Draw node groups (circle + label).
    const node = g.append("g").selectAll("g")
        .data(nodes).enter().append("g")
        .attr("cursor", "pointer")
        .call(
            d3.drag()
                .on("start", (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
                .on("drag",  (e, d) => { d.fx = e.x; d.fy = e.y; })
                .on("end",   (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
        );

    node.append("circle")
        .attr("r",    d => d.type === "user" ? 24 : 16)
        .attr("fill", d => d.type === "user" ? "#1a7ed5" : "#c9570b")
        .attr("stroke",       d => d.type === "user" ? "#2061b7" : "#503308")
        .attr("stroke-width", 1.5);

    node.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", d => d.type === "user" ? 38 : 29)
        .attr("font-size", "12px")
        .attr("fill", "#363955")
        .attr("pointer-events", "none")
        .text(d => d.label);

    // Show contact details in the contactDetail div on click. (DEBUG for now)
    node.on("click", (e, d) =>
    {
        if (d.type === "contact")
        {
            document.getElementById("contactDetail").innerHTML =
                "<strong>" + d.label + "</strong><br>" +
                d.phone + "<br>" + d.email;
        }
    });

    // Update positions each tick.
    sim.on("tick", () =>
    {
        link
            .attr("x1", d => d.source.x).attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x).attr("y2", d => d.target.y);

        node.attr("transform", d => `translate(${d.x},${d.y})`);
    });
}