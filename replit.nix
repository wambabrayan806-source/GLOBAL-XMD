{ pkgs }: {
    deps = [
        pkgs.nodejs_20
        pkgs.nodePackages.typescript
        pkgs.ffmpeg
        pkgs.imagemagick
        pkgs.git
        pkgs.neofetch
        pkgs.libwebp
        pkgs.speedtest-cli
        pkgs.wget
        pkgs.yarn
        pkgs.libuuid
        pkgs.python3
    ];
    env = {
        LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
            pkgs.libuuid
            pkgs.stdenv.cc.cc.lib
        ];
    };
}
