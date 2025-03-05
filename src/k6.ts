// Module to setup k6
import * as core from '@actions/core';
import { getPlatform } from "./platform";
import { getLatestVersion, downloadAndExtractBinary, addBinaryInPath, SUPPORTED_OS_TO_ARCH_MAP } from "./downloadUtils";

const BaseK6DownloadURL = 'https://github.com/grafana/k6/releases/download';
const k6RepoOwner = 'grafana';
const k6Repo = 'k6';

export async function setupK6(version?: string): Promise<string> {
    const platform = getPlatform();
    core.debug(`Setting up k6 for ${platform.os} ${platform.arch}`);

    if (!(platform.os in SUPPORTED_OS_TO_ARCH_MAP)) {
        throw new Error(`Unsupported platform: ${platform.os}`);
    }

    if (!SUPPORTED_OS_TO_ARCH_MAP[platform.os].includes(platform.arch)) {
        throw new Error(`Unsupported architecture: ${platform.arch} for ${platform.os}`);
    }

    if (!version) version = await getLatestVersion(k6RepoOwner, k6Repo);

    const [extractedPath, binaryName] = await downloadAndExtractBinary(BaseK6DownloadURL, version, platform.os, platform.arch, `k6-v${version}-${platform.os}-${platform.arch}`);
    return addBinaryInPath(extractedPath, binaryName);
}