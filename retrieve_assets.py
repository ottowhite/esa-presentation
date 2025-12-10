#!/usr/bin/env python3
"""
Retrieve assets from local or remote sources into the assets folder.

Usage:
    python retrieve_assets.py <config.json>

The JSON config file should contain a list of file entries with:
    - source: source path (required)
    - destination: destination path within assets folder (required)
    - remote_host: hostname for SCP (optional)
    - remote_user: username for SCP (optional)
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path


def get_ssh_keys():
    """Get list of keys loaded in ssh-agent."""
    result = subprocess.run(
        ["ssh-add", "-l"],
        capture_output=True,
        text=True
    )
    return result.stdout.strip(), result.returncode


def copy_local(source: str, destination: Path) -> bool:
    """Copy a local file or directory."""
    destination.parent.mkdir(parents=True, exist_ok=True)
    result = subprocess.run(
        ["cp", "-r", source, str(destination)],
        capture_output=True,
        text=True
    )
    if result.returncode != 0:
        print(f"  Error: {result.stderr.strip()}")
        return False
    return True


def copy_remote(source: str, destination: Path, remote_host: str, remote_user: str) -> bool:
    """Copy a file or directory from a remote host via SCP."""
    destination.parent.mkdir(parents=True, exist_ok=True)
    remote_path = f"{remote_user}@{remote_host}:{source}"
    result = subprocess.run(
        ["scp", "-r", remote_path, str(destination)],
        capture_output=True,
        text=True
    )
    if result.returncode != 0:
        print(f"  Error: {result.stderr.strip()}")
        return False
    return True


def main():
    parser = argparse.ArgumentParser(
        description="Retrieve assets from local or remote sources"
    )
    parser.add_argument(
        "config",
        help="JSON configuration file with list of files to retrieve"
    )
    args = parser.parse_args()

    # Load configuration
    config_path = Path(args.config)
    if not config_path.exists():
        print(f"Error: Config file '{args.config}' not found")
        sys.exit(1)

    with open(config_path) as f:
        entries = json.load(f)

    if not isinstance(entries, list):
        print("Error: Config file must contain a JSON array")
        sys.exit(1)

    # Check if any entries require remote access
    has_remote = any(
        entry.get("remote_host") and entry.get("remote_user")
        for entry in entries
    )

    if has_remote:
        print("Remote files detected. Checking SSH agent...")
        keys_output, returncode = get_ssh_keys()
        if returncode != 0:
            print("Warning: Could not list SSH keys. ssh-agent may not be running.")
            print(f"  {keys_output}")
        else:
            print("The following SSH keys will be attempted for secure copy:")
            print(keys_output)
        print()

    # Process each entry
    assets_dir = Path("assets")
    success_count = 0
    fail_count = 0

    for entry in entries:
        source = entry.get("source")
        destination = entry.get("destination")
        remote_host = entry.get("remote_host")
        remote_user = entry.get("remote_user")

        if not source or not destination:
            print(f"Skipping invalid entry (missing source or destination): {entry}")
            fail_count += 1
            continue

        dest_path = assets_dir / destination

        if remote_host and remote_user:
            print(f"Copying (remote): {remote_user}@{remote_host}:{source} -> {dest_path}")
            success = copy_remote(source, dest_path, remote_host, remote_user)
        else:
            print(f"Copying (local): {source} -> {dest_path}")
            success = copy_local(source, dest_path)

        if success:
            print("  Done")
            success_count += 1
        else:
            fail_count += 1

    print()
    print(f"Completed: {success_count} succeeded, {fail_count} failed")

    if fail_count > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
