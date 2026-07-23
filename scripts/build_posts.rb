#!/usr/bin/env ruby

# Turn easy-to-name Markdown files in resources/posts/ into dated Jekyll posts.
# Git is the clock: the first commit supplies created_at, the latest commit
# supplies updated_at, and every revision is included in the post metadata.
require "date"
require "digest"
require "fileutils"
require "open3"
require "pathname"
require "time"
require "yaml"

ROOT = Pathname.new(__dir__).parent
SOURCE_DIR = ROOT.join("resources", "posts")
POSTS_DIR = ROOT.join("_posts")

def read_source(path)
  contents = path.read
  match = contents.match(/\A---\s*\n(.*?)\n---\s*(?:\n|\z)(.*)\z/m)
  raise "#{path} needs YAML front matter" unless match

  metadata = YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: true) || {}
  [metadata, match[2]]
end

def git_history(path)
  relative = path.relative_path_from(ROOT).to_s
  output, status = Open3.capture2(
    "git", "log", "--follow", "--format=%H%x09%aI%x09%s", "--", relative,
    chdir: ROOT.to_s
  )
  return [] unless status.success?

  output.lines.each_with_object([]) do |line, entries|
    commit, date, message = line.strip.split("\t", 3)
    next if commit.to_s.empty? || date.to_s.empty?

    entries << {
      "commit" => commit,
      "date" => date,
      "message" => message.to_s
    }
  end
end

def timestamp(value, fallback)
  return fallback.iso8601 if value.nil? || value.to_s.empty?
  return Time.utc(value.year, value.month, value.day).iso8601 if value.is_a?(Date) && !value.is_a?(DateTime)

  Time.parse(value.to_s).iso8601
end

def slug_for(path, metadata)
  requested = metadata["slug"] || path.basename(".md").to_s
  slug = requested.downcase.gsub(/[^[:alnum:]]+/u, "-").gsub(/\A-|\z/, "")
  slug.empty? ? "post-#{Digest::SHA1.hexdigest(requested)[0, 8]}" : slug
end

FileUtils.rm_rf(POSTS_DIR)
FileUtils.mkdir_p(POSTS_DIR)

sources = SOURCE_DIR.directory? ? Dir[SOURCE_DIR.join("*.md").to_s].sort : []
sources.reject! { |name| File.basename(name).start_with?("_") }

sources.each do |source_name|
  source = Pathname.new(source_name)
  metadata, body = read_source(source)
  history = git_history(source)
  fallback = source.mtime
  created_at = timestamp(metadata["created_at"], history.last ? Time.parse(history.last["date"]) : fallback)
  updated_at = timestamp(metadata["updated_at"], history.first ? Time.parse(history.first["date"]) : fallback)
  slug = slug_for(source, metadata)

  metadata.delete("slug")
  metadata["layout"] ||= "post"
  metadata["date"] = created_at
  metadata["created_at"] = created_at
  metadata["updated_at"] = updated_at
  metadata["source_path"] = source.relative_path_from(ROOT).to_s
  metadata["history"] = history

  date_prefix = Time.parse(created_at).strftime("%Y-%m-%d")
  destination = POSTS_DIR.join("#{date_prefix}-#{slug}.md")
  destination.write("#{YAML.dump(metadata)}---\n\n#{body.lstrip}")
end

puts "Built #{sources.length} blog posts in #{POSTS_DIR.relative_path_from(ROOT)}"
