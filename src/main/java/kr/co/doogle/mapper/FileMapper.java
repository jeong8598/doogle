package kr.co.doogle.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.co.doogle.dto.FileDTO;

public interface FileMapper {

	@Select("select * from files ${param1}")
	List<FileDTO> getAll(@Param("where") String where, @Param("ctno") int ctno);

	@Select("select count(*) from files ${param1}")
	int getTotal(@Param("where") String where, @Param("ctno") int ctno);

	@Select("select s_files.nextval from dual")
	int getSeq();

	@Insert("insert into files(fno, name, real_name, loc, ctno) values(s_files.nextval, #{dto.name}, #{dto.real_name}, #{dto.loc}, #{dto.ctno})")
	int add(@Param("dto") FileDTO dto);

}