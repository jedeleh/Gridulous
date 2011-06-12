class CreatePeople < ActiveRecord::Migration
  def self.up
    create_table :people do |t|
      t.string :first_name
      t.string :last_name
      t.string :middle_initial
      t.string :email
      t.datetime :date_of_birth
      t.string :role

      t.timestamps
    end
  end

  def self.down
    drop_table :people
  end
end
