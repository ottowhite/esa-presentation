{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    process-compose
  ];

  shellHook = ''
    npm install
  '';
}