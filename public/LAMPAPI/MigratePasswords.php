<?php
	// ============================================================
	// ONE-TIME MIGRATION SCRIPT — run once, then DELETE this file
	// from the server. Anyone who can reach it can re-run it
	// (harmless, but it has the DB credentials in it like the rest).
	//	//   
	// Run it by visiting https://tetherbyzans.com/LAMPAPI/MigratePasswords.php
	// once, confirming the output, then deleting it.
	// ============================================================

	$connection = new mysqli("localhost", "ContactUser", "ContactPassword123!", "ContactManager");
	if ($connection->connect_error)
	{
		die("Connect failed: " . $connection->connect_error);
	}

	// Step 1: make sure the column can hold a bcrypt hash.
	if (!$connection->query("ALTER TABLE Users MODIFY Password VARCHAR(255) NOT NULL"))
	{
		die("Could not widen Password column: " . $connection->error);
	}

	// Step 2: hash anything that isn't already hashed.
	$result = $connection->query("SELECT ID, Password FROM Users");
	$update = $connection->prepare("UPDATE Users SET Password=? WHERE ID=?");

	$migrated = 0;
	$skipped = 0;

	while ($row = $result->fetch_assoc())
	{
		$info = password_get_info($row["Password"]);

		// algo is null (PHP 8) or 0 (PHP 7) for strings that are not
		// recognized password hashes — i.e., our plaintext rows.
		if ($info["algo"] !== null && $info["algo"] !== 0)
		{
			$skipped++;
			continue;
		}

		$hash = password_hash($row["Password"], PASSWORD_DEFAULT);
		$update->bind_param("si", $hash, $row["ID"]);
		$update->execute();
		$migrated++;
	}

	echo "Password column widened to VARCHAR(255).<br>";
	echo "Migrated (hashed): " . $migrated . "<br>";
	echo "Already hashed (skipped): " . $skipped . "<br>";
	echo "<strong>Now delete MigratePasswords.php from the server.</strong>";

	$update->close();
	$connection->close();
?>
