// Module to download k6 or k6-dashboards binary
// TODO: can maybe ask the user to provide the download URL
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import { Octokit } from "@octokit/rest";
import chmodr from 'chmodr';
import { renameSync } from 'fs-extra';
import { Arch, OS } from "./platform";

export const SUPPORTED_OS_TO_ARCH_MAP: { [key in OS]: Arch[] } = {
    [OS.LINUX]: [Arch.AMD64, Arch.ARM64],
    [OS.DARWIN]: [Arch.AMD64, Arch.ARM64],
    [OS.WINDOWS]: [Arch.AMD64]
}

export async function getLatestVersion(owner: string, repo: string): Promise<string> {
    let version = '';
    const token = core.getInput('github-token', { required: false });
    const octokit = new Octokit({ auth: token });
    const { data } = await octokit.repos.getLatestRelease({ owner, repo });

    version = data.tag_name.startsWith('v') ? data.tag_name.slice(1) : data.tag_name;
    core.debug(`Latest version of ${repo} is ${version}`);

    return version;
}

export async function downloadAndExtractBinary(baseURL: string, version: string, os: OS, architecture: Arch, binaryName: string): Promise<[string, string]> {
    const downloadUrl = `${baseURL}/v${version}/${binaryName}.${os === OS.LINUX ? 'tar.gz' : 'zip'}`;

    core.info(`Downloading from ${downloadUrl} for ${os} ${architecture}`);
    const download = await tc.downloadTool(downloadUrl);
    const extractedPath = await tc.extractTar(download);

    return [extractedPath, binaryName];
}

export function addBinaryInPath(extractedPath: string, binaryName: string): string {
    const downloadedBinaryPath = `${extractedPath}/${binaryName}`;
    const expectedPath = `${extractedPath}/binary`;

    renameSync(downloadedBinaryPath, expectedPath);
    chmodr(expectedPath, 0o0755, err => { if (err) throw err; });

    core.addPath(expectedPath);
    return expectedPath;
}