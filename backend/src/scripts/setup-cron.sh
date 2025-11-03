#!/bin/bash
# Setup Cron Jobs for Tide Data Fetching
# This script helps you install the cron jobs for alternating tide data fetches

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Tide Data Cron Setup ===${NC}\n"

# Get the absolute path to the backend directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$( cd "$SCRIPT_DIR/../.." && pwd )"

echo -e "${GREEN}Backend directory: ${BACKEND_DIR}${NC}\n"

# Check if node is available
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}ERROR: Node.js not found. Please install Node.js first.${NC}"
    exit 1
fi

# Check if .env exists
if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo -e "${YELLOW}WARNING: .env file not found at $BACKEND_DIR/.env${NC}"
    echo "Make sure STORMGLASS_API_KEY is configured before running cron jobs."
fi

echo -e "${BLUE}Cron jobs to be added:${NC}\n"

echo "# Fetch tide extremes on odd dates (1st, 3rd, 5th, etc.) at 6:00 AM"
echo "0 6 1-31/2 * * cd $BACKEND_DIR && node src/scripts/fetchTideData.js >> $BACKEND_DIR/logs/tide-fetch.log 2>&1"
echo ""
echo "# Fetch sea level data on even dates (2nd, 4th, 6th, etc.) at 6:00 AM"
echo "0 6 2-30/2 * * cd $BACKEND_DIR && node src/scripts/fetchSeaLevelData.js >> $BACKEND_DIR/logs/sealevel-fetch.log 2>&1"
echo ""

# Create logs directory
mkdir -p "$BACKEND_DIR/logs"
echo -e "${GREEN}Created logs directory: $BACKEND_DIR/logs${NC}\n"

# Ask user if they want to install
read -p "Do you want to add these cron jobs? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Create temporary cron file
    TEMP_CRON=$(mktemp)

    # Get existing crontab
    crontab -l > "$TEMP_CRON" 2>/dev/null || true

    # Add our cron jobs
    echo "" >> "$TEMP_CRON"
    echo "# TidyApp - Tide Data Fetching (Alternating Schedule)" >> "$TEMP_CRON"
    echo "0 6 1-31/2 * * cd $BACKEND_DIR && node src/scripts/fetchTideData.js >> $BACKEND_DIR/logs/tide-fetch.log 2>&1" >> "$TEMP_CRON"
    echo "0 6 2-30/2 * * cd $BACKEND_DIR && node src/scripts/fetchSeaLevelData.js >> $BACKEND_DIR/logs/sealevel-fetch.log 2>&1" >> "$TEMP_CRON"

    # Install new crontab
    crontab "$TEMP_CRON"
    rm "$TEMP_CRON"

    echo -e "\n${GREEN}✓ Cron jobs installed successfully!${NC}\n"
    echo -e "${BLUE}View your crontab:${NC}"
    echo "  crontab -l"
    echo ""
    echo -e "${BLUE}View logs:${NC}"
    echo "  tail -f $BACKEND_DIR/logs/tide-fetch.log"
    echo "  tail -f $BACKEND_DIR/logs/sealevel-fetch.log"
    echo ""
    echo -e "${YELLOW}Note: Logs will appear after first run (tomorrow at 6am)${NC}"
else
    echo -e "\n${YELLOW}Installation cancelled. You can manually add the cron jobs using 'crontab -e'${NC}"
fi
