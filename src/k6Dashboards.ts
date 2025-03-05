// k6Dashboards.ts
import * as core from '@actions/core';
import { getPlatform } from "./platform";
import { getLatestVersion, downloadAndExtractBinary, addBinaryInPath, SUPPORTED_OS_TO_ARCH_MAP } from "./downloadUtils";

const BaseK6DashboardsDownloadURL = 'https://github.com/grafana/xk6-dashboard/releases/download';
const k6DashboardsRepoOwner = 'grafana';
const k6DashboardsRepo = 'xk6-dashboard';

export async function setupK6Dashboards(version?: string): Promise<string> {
    const platform = getPlatform();
    core.debug(`Setting up k6 dashboards for ${platform.os} ${platform.arch}`);

    if (!(platform.os in SUPPORTED_OS_TO_ARCH_MAP)) {
        throw new Error(`Unsupported platform: ${platform.os}`);
    }

    if (!SUPPORTED_OS_TO_ARCH_MAP[platform.os].includes(platform.arch)) {
        throw new Error(`Unsupported architecture: ${platform.arch} for ${platform.os}`);
    }

    if (!version) version = await getLatestVersion(k6DashboardsRepoOwner, k6DashboardsRepo);

    const [extractedPath, binaryName] = await downloadAndExtractBinary(BaseK6DashboardsDownloadURL, version, platform.os, platform.arch, `k6-dashboards-v${version}-${platform.os}-${platform.arch}`);
    return addBinaryInPath(extractedPath, binaryName);
}