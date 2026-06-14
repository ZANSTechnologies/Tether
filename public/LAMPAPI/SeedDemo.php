<?php
	// ============================================================
	// ONE-TIME SEED SCRIPT — run once, then DELETE this file.
	//
	// Creates the demo account:
	//   Login:    Username
	//   Password: Password
	//   Name:     Tether Admin  (so the dashboard greeting isn't blank)
	// ...and gives it 10 contacts with varied email domains so the
	// list, the bubble graph, and the (upcoming) sort-by-email-domain
	// feature all have something to show on demo day.
	//
	// NOTE: "Password" intentionally does NOT meet the registration
	// criteria — it's seeded directly here, bypassing Register.php.
	// That's fine for a known demo account.
	//
	// Run it by visiting https://tetherbyzans.com/LAMPAPI/SeedDemo.php
	// once, then deleting it.
	// ============================================================

	$connection = new mysqli("localhost", "ContactUser", "ContactPassword123!", "ContactManager");
	if ($connection->connect_error)
	{
		die("Connect failed: " . $connection->connect_error);
	}

	// Bail if the demo account already exists.
	$check = $connection->prepare("SELECT ID FROM Users WHERE Login=?");
	$demoLogin = "Username";
	$check->bind_param("s", $demoLogin);
	$check->execute();
	if ($check->get_result()->fetch_assoc())
	{
		die("Demo account 'Username' already exists — nothing to do. Delete this file.");
	}
	$check->close();

	// Create the demo user with a properly hashed password.
	$first = "Tether";
	$last = "Admin";
	$hash = password_hash("Password", PASSWORD_DEFAULT);

	$insertUser = $connection->prepare("INSERT INTO Users (FirstName,LastName,Login,Password) VALUES(?,?,?,?)");
	$insertUser->bind_param("ssss", $first, $last, $demoLogin, $hash);
	$insertUser->execute();
	$demoUserID = $insertUser->insert_id;
	$insertUser->close();

	// Seed contacts. Email domains are deliberately varied (gmail, yahoo,
	// outlook, protonmail, icloud) for the sort-by-domain feature.
	$contacts = array(
		array("Priya", "Nambiar", "3215550347", "priya.nambiar@outlook.com"),
		array("Jordan", "Whitfield", "8135550219", "j.whitfield@yahoo.com"),
		array("Sofia", "Reinholt", "9545550763", "sofia.reinholt@gmail.com"),
		array("Devon", "Kasprowicz", "4075550491", "dkasprowicz@protonmail.com"),
		array("Yuki", "Tanomura", "7865550138", "yuki.tanomura@gmail.com"),
		array("Brennan", "Okafor", "3215550627", "brennan.okafor@outlook.com"),
		array("Camille", "Trevino", "9045550854", "c.trevino@gmail.com"),
		array("Marcus", "Bell", "4075550112", "marcus.bell@yahoo.com"),
		array("Anneliese", "Fontaine", "8635550390", "a.fontaine@icloud.com"),
		array("Rohan", "Iyer", "7275550266", "rohan.iyer@protonmail.com")
	);

	$insertContact = $connection->prepare(
		"INSERT INTO Contacts (FirstName,LastName,Phone,Email,UserID) VALUES(?,?,?,?,?)");

	$added = 0;
	foreach ($contacts as $c)
	{
		$insertContact->bind_param("ssssi", $c[0], $c[1], $c[2], $c[3], $demoUserID);
		if ($insertContact->execute())
		{
			$added++;
		}
	}
	$insertContact->close();

	echo "Demo user 'Username' created (ID " . $demoUserID . ") with " . $added . " contacts.<br>";
	echo "<strong>Now delete SeedDemo.php from the server.</strong>";

	$connection->close();
?>
