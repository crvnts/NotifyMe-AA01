import pandas as pd

def read_csv_from_url(url):
    """Reads CSV file from a given URL and returns the dataframe."""
    return pd.read_csv(url)

def merge_dataframes(df_list):
    """Merges a list of dataframes into a single dataframe."""
    return pd.concat(df_list, ignore_index=True)

def filter_zero_delay(df):
    """Filters out rows with Min Delay equal to 0."""
    return df[df['Min Delay'] == 0]

def filter_non_zero_delay(df):
    """Filters out rows with Min Delay not equal to 0."""
    return df[df['Min Delay'] != 0]

def separate_by_day_hour_filter(df):
    """Separates the dataframe into separate dataframes based on day and hour, excluding 3 am to 5 am."""
    df['Time'] = pd.to_datetime(df['Time'])
    # Filter out hours from 3 am to 5 am inclusive
    df = df[~df['Time'].dt.hour.isin(range(3, 6))]
    grouped_by_day_hour = df.groupby([df['Day'], df['Time'].dt.hour])
    
    day_hour_dataframes = {}
    for (day, hour), group_df in grouped_by_day_hour:
        day_hour_dataframes.setdefault(day, {}).setdefault(hour, group_df)
    
    return day_hour_dataframes

def separate_by_day_hour(df):
    """Separates the dataframe into separate dataframes based on day and hour, excluding 3 am to 5 am."""
    df['Time'] = pd.to_datetime(df['Time'])
    # Filter out hours from 3 am to 5 am inclusive
    grouped_by_day_hour = df.groupby([df['Day'], df['Time'].dt.hour])
    
    day_hour_dataframes = {}
    for (day, hour), group_df in grouped_by_day_hour:
        day_hour_dataframes.setdefault(day, {}).setdefault(hour, group_df)
    
    return day_hour_dataframes

def calculate_average_delay(non_zero_day_hour_delay_dataframes):
    """Calculates the average delay for each day and hour."""
    average_delays = {}
    for day, hour_dict in non_zero_day_hour_delay_dataframes.items():
        for hour, df in hour_dict.items():
            try:
                average_delay = df['Min Delay'].mean()
                average_delays.setdefault(day, {}).setdefault(hour, average_delay)
            except KeyError:
                print(f"Error: No 'Min Delay' data for {day} at {hour}:00")
    return average_delays

def print_dataframes_info(dataframes_dict):
    """Prints the size of each dataframe."""
    for category, df in dataframes_dict.items():
        print(f"{category} dataframe: {df.shape[0]} rows x {df.shape[1]} columns")

def calculate_hourly_non_zero_delay_percentage(day_hour_dataframes):
    """Calculates the frequency of non-zero delay for each hour of each day."""
    hourly_non_zero_delay_percentage = {}
    for day, hour_dict in day_hour_dataframes.items():
        total_non_zero_delay_count = sum(df[df['Min Delay'] != 0].shape[0] for df in hour_dict.values())
        for hour, df in hour_dict.items():
            non_zero_delay_count = df[df['Min Delay'] != 0].shape[0]
            if total_non_zero_delay_count > 0:  # Avoid division by zero
                hourly_non_zero_delay_percentage.setdefault(day, {}).setdefault(hour, (non_zero_delay_count / total_non_zero_delay_count) * 100)
            else:
                hourly_non_zero_delay_percentage.setdefault(day, {}).setdefault(hour, 0)
    return hourly_non_zero_delay_percentage


def save_to_csv(data, filename):
    """Saves the data to a CSV file."""
    df = pd.DataFrame(data)
    df = df.reindex(range(24), fill_value=0)
    df.to_csv(filename, index=True)

def print_averages_and_frequency(average_delays, hourly_non_zero_delay_percentage):
    """Prints the averages and frequency nicely."""
    print("\nAverage delay for each day and hour:")
    for day, hour_dict in average_delays.items():
        for hour, average_delay in hour_dict.items():
            print(f"{day}, {hour}:00 - Average Delay: {average_delay:.2f} minutes")
    print("\nFrequency of non-zero delay for each day and hour:")
    for day, hour_dict in hourly_non_zero_delay_percentage.items():
        for hour, percentage in hour_dict.items():
            print(f"{day}, {hour}:00 - Frequency of Non-zero Delay: {percentage:.2f}%")

def main():
        # URLs of the CSV files
    """ url_2021 = 'https://raw.githubusercontent.com/rjeong1530/TTC-Data-analysis/main/csv/ttc-subway-delay-data-2021.csv'
    url_2022 = 'https://raw.githubusercontent.com/rjeong1530/TTC-Data-analysis/main/csv/ttc-subway-delay-data-2022.csv'
    url_2023 = 'https://raw.githubusercontent.com/rjeong1530/TTC-Data-analysis/main/csv/ttc-subway-delay-data-2023.csv'
    url_2024 = 'https://raw.githubusercontent.com/rjeong1530/TTC-Data-analysis/main/csv/ttc-subway-delay-data-2024.csv'
    # Read CSV files from URLs
    df_2021 = read_csv_from_url(url_2021)
    df_2022 = read_csv_from_url(url_2022)
    df_2023 = read_csv_from_url(url_2023)
    df_2024 = read_csv_from_url(url_2024)
    
    # Merge dataframes
    merged_df = merge_dataframes([df_2021, df_2022, df_2023, df_2024])
    
    # Filter rows with Min Delay > 0
    non_zero_merged_df = filter_non_zero_delay(merged_df)
    zero_merged_df = filter_zero_delay(merged_df)
    # Separate dataframes by day, hour, and delay status
    non_zero_day_hour_delay_dataframes = separate_by_day_hour(non_zero_merged_df)
    day_hour_delay_dataframes = separate_by_day_hour(merged_df)
    average_delays = calculate_average_delay(non_zero_day_hour_delay_dataframes)
    frequency = calculate_hourly_non_zero_delay_percentage(day_hour_delay_dataframes)
    print_averages_and_frequency(average_delays,frequency)
    # Save average delays to CSV
    save_to_csv(average_delays, 'average_delays_subway.csv')
    
    # Save frequency data to CSV
    save_to_csv(frequency, 'frequency_data_subway.csv') """
    url_2021 = 'https://raw.githubusercontent.com/rjeong1530/TTC-Data-analysis/main/csv/ttc-bus-delay-data-2021.csv'
    url_2022 = 'https://raw.githubusercontent.com/rjeong1530/TTC-Data-analysis/main/csv/ttc-bus-delay-data-2022.csv'
    url_2023 = 'https://raw.githubusercontent.com/rjeong1530/TTC-Data-analysis/main/csv/ttc-bus-delay-data-2023.csv'
    url_2024 = 'https://raw.githubusercontent.com/rjeong1530/TTC-Data-analysis/main/csv/ttc-bus-delay-data-2024.csv'
    # Read CSV files from URLs
    df_2021 = read_csv_from_url(url_2021)
    df_2022 = read_csv_from_url(url_2022)
    df_2023 = read_csv_from_url(url_2023)
    df_2024 = read_csv_from_url(url_2024)
    merged_df = merge_dataframes([df_2021, df_2022, df_2023, df_2024])
    
    # Filter rows with Min Delay > 0
    non_zero_merged_df = filter_non_zero_delay(merged_df)
    zero_merged_df = filter_zero_delay(merged_df)
    # Separate dataframes by day, hour, and delay status
    non_zero_day_hour_delay_dataframes = separate_by_day_hour(non_zero_merged_df)
    day_hour_delay_dataframes = separate_by_day_hour(merged_df)
    average_delays = calculate_average_delay(non_zero_day_hour_delay_dataframes)
    frequency = calculate_hourly_non_zero_delay_percentage(day_hour_delay_dataframes)
    print_averages_and_frequency(average_delays,frequency)
    # Save average delays to CSV
    save_to_csv(average_delays, 'average_delays_bus.csv')
    
    # Save frequency data to CSV
    save_to_csv(frequency, 'frequency_data_bus.csv') 
if __name__ == "__main__":
    main()
